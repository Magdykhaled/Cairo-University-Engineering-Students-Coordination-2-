import { prisma } from "./db";

// دالة تشغيل خوارزمية التنسيق والتوزيع الذكي للطلاب
export async function runAllocationProcess() {
  return await prisma.$transaction(async (tx: any) => {
    
    // 1. جلب الطاقة الاستيعابية الحالية لكل قسم من الأقسام الأربعة
    const capacities = await tx.departmentCapacity.findMany();
    const capacityMap = new Map<string, number>();
    const assignmentMap = new Map<string, string[]>();

    // تجهيز خريطة لحساب الأماكن المتاحة والطلاب المقبولين في كل قسم
    capacities.forEach((c) => {
      capacityMap.set(c.deptCode, c.capacity);
      assignmentMap.set(c.deptCode, []);
    });

    // 2. تصغير أو تصفير التوزيعات القديمة للبدء من جديد بنقاء
    await tx.student.updateMany({
      data: { allocatedDept: null },
    });

    // 3. جلب جميع الطلاب وترتيبهم تنازلياً من الـ GPA الأعلى إلى الأقل
    // وفي حال التساوي في المجموع، الأولوية لمن نسق ورتب رغباته أولاً (createdAt)
    const students = await tx.student.findMany({
      orderBy: [
        { gpa: "desc" },
        { createdAt: "asc" }
      ]
    });

    // 4. خوارزمية التوزيع المبنية على مجموع الطالب ورغباته المرتبة
    for (const student of students) {
      const choices = [
        student.firstChoice,
        student.secondChoice,
        student.thirdChoice,
        student.fourthChoice
      ];

      let assigned = false;
      
      // المرور على رغبات الطالب الأربعة بالترتيب
      for (const choice of choices) {
        const currentCap = capacityMap.get(choice) || 0;
        const currentAssigned = assignmentMap.get(choice)?.length || 0;

        // إذا كان هناك مكان شاغر في القسم (لم يتعدى السعة الاستيعابية)
        if (currentAssigned < currentCap) {
          assignmentMap.get(choice)?.push(student.id);
          assigned = true;
          
          // حفظ القسم الذي تم تنسيق الطالب عليه في قاعدة البيانات
          await tx.student.update({
            where: { id: student.id },
            data: { allocatedDept: choice }
          });
          break; // الخروج من الحلقة والانتقال للطالب التالي بعد تسكينه بنجاح
        }
      }

      // حالة استثنائية: إذا كانت جميع رغبات الطالب ممتلئة تماماً ولم يجد مكاناً
      if (!assigned) {
        await tx.student.update({
          where: { id: student.id },
          data: { allocatedDept: "UNALLOCATED" } // غير موزع لحين مراجعة الأدمن
        });
      }
    }

    return { success: true, totalProcessed: students.length };
  });
}