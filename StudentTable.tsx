"use client";

import React, { useState } from "react";

// قائمة الأقسام الـ 13 لترجمة الأكواد لأسماء مفهومة داخل الجدول
const deptMap: { [key: string]: string } = {
  CMP: "حاسبات والمنظومات",
  CCE: "الإلكترونيات والاتصالات",
  EE: "الهندسة الكهربائية",
  BME: "الطبية والأجهزة",
  POW: "ميكانيكا باور",
  AERO: "الطيران والفضاء",
  PROD: "الإنتاج والتصميم",
  CHM: "الهندسة الكيميائية",
  ARC: "الهندسة المعمارية",
  CIV: "الهندسة المدنية",
  PET: "هندسة البترول",
  MIN: "هندسة المناجم",
  MET: "الفلزات والمعادن",
};

interface StudentTableProps {
  initialData?: any[];
}

export default function StudentTable({ initialData }: StudentTableProps) {
  // بيانات افتراضية بأسماء الأقسام الـ 13 الجديدة للعرض التجريبي في الـ Compiler
  const defaultStudents = [
    { id: "1", fullName: "أحمد علي منصور", gpa: 3.92, firstChoice: "CMP", secondChoice: "CCE", thirdChoice: "POW", fourthChoice: "ARC", allocatedDept: "CMP" },
    { id: "2", fullName: "سارة محمد أحمد", gpa: 3.85, firstChoice: "CCE", secondChoice: "CMP", thirdChoice: "BME", fourthChoice: "EE", allocatedDept: "CCE" },
    { id: "3", fullName: "عمر حسين مصطفى", gpa: 3.41, firstChoice: "POW", secondChoice: "PROD", thirdChoice: "MEC", fourthChoice: "CIV", allocatedDept: "POW" },
    { id: "4", fullName: "مريم محمود حسن", gpa: 2.95, firstChoice: "CIV", secondChoice: "ARC", thirdChoice: "CHM", fourthChoice: "MET", allocatedDept: "CIV" },
    { id: "5", fullName: "كريم عبد العزيز فؤاد", gpa: 3.62, firstChoice: "PET", secondChoice: "MIN", thirdChoice: "CHM", fourthChoice: "CIV", allocatedDept: "PET" },
  ];

  const [students] = useState(initialData || defaultStudents);
  const [search, setSearch] = useState("");

  // دالة تحويل الجدول لملف CSV وتحميله فوراً على جهازك
  const exportToCSV = () => {
    // العناوين الرئيسية للملف
    const headers = "ID,اسم الطالب,المعدل تراكمي GPA,الرغبة 1,الرغبة 2,الرغبة 3,الرغبة 4,القسم الموزع عليه\n";
    
    // تحويل صفوف الطلاب لنصوص مفصولة بفواصل
    const rows = students.map(s => 
      `"${s.id}","${s.fullName}",${s.gpa},"${deptMap[s.firstChoice] || s.firstChoice}","${deptMap[s.secondChoice] || s.secondChoice}","${deptMap[s.thirdChoice] || s.thirdChoice}","${deptMap[s.fourthChoice] || s.fourthChoice}","${deptMap[s.allocatedDept] || 'قيد الانتظار'}"`
    ).join("\n");

    // إنشاء ملف التحميل وتحديد التشفير (UTF-8) ليدعم اللغة العربية بدون مشاكل
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "تنسيق_رغبات_الطلاب_13_قسم.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // تصفية الطلاب بناءً على خانة البحث بالاسم
  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div dir="rtl" className="w-full">
      {/* أدوات التحكم فوق الجدول: البحث والتصدير */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="🔍 ابحث عن طالب بالاسم..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 bg-slate-50"
          />
        </div>
        <button 
          onClick={exportToCSV} 
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
        >
          <span>تصدير البيانات لملف شيت (Excel/CSV)</span>
          <span>📊</span>
        </button>
      </div>

      {/* الجدول الرئيسي */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-sm text-right text-slate-600 border-collapse">
          <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-200 uppercase font-black">
            <tr>
              <th className="px-4 py-3.5">اسم الطالب ثلاثي/رباعي</th>
              <th className="px-4 py-3.5 text-center">المعدل (GPA)</th>
              <th className="px-4 py-3.5">الرغبة 1</th>
              <th className="px-4 py-3.5">الرغبة 2</th>
              <th className="px-4 py-3.5">الرغبة 3</th>
              <th className="px-4 py-3.5">الرغبة 4</th>
              <th className="px-4 py-3.5 text-center">الترشيح الحالي</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="bg-white border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="px-4 py-4 font-bold text-slate-900">{student.fullName}</td>
                  <td className="px-4 py-4 text-center font-mono font-bold text-blue-600 bg-blue-50/30">{student.gpa.toFixed(2)}</td>
                  <td className="px-4 py-4 text-xs text-slate-700">{deptMap[student.firstChoice] || student.firstChoice}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{deptMap[student.secondChoice] || student.secondChoice}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{deptMap[student.thirdChoice] || student.thirdChoice}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{deptMap[student.fourthChoice] || student.fourthChoice}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-black shadow-2xs ${
                      student.allocatedDept 
                        ? "bg-purple-100 text-purple-800 border border-purple-200" 
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {deptMap[student.allocatedDept] || "قيد الانتظار"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 bg-white font-medium">
                  لا يوجد طلاب يطابقون بحثك حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}