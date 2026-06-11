'use client';

import React, { useState } from 'react';

// قائمة الـ 13 قسم الرسمية المعتمدة
const departments = [
  {
    code: 'CMP',
    nameAr: 'هندسة الحاسبات والمنظومات',
    nameEn: 'Computer & Systems Engineering',
  },
  {
    code: 'CCE',
    nameAr: 'هندسة الإلكترونيات والاتصالات',
    nameEn: 'Electronics & Communications Engineering',
  },
  {
    code: 'EE',
    nameAr: 'الهندسة الكهربائية (قوى وآلات)',
    nameEn: 'Electrical Power Engineering',
  },
  {
    code: 'BME',
    nameAr: 'الهندسة الطبية الحيوية والأجهزة',
    nameEn: 'Biomedical Engineering',
  },
  {
    code: 'POW',
    nameAr: 'الهندسة الميكانيكية (قوى وريد)',
    nameEn: 'Mechanical Power Engineering',
  },
  {
    code: 'AERO',
    nameAr: 'هندسة الطيران والفضاء',
    nameEn: 'Aerospace Engineering',
  },
  {
    code: 'PROD',
    nameAr: 'هندسة الإنتاج والتصميم الميكانيكي',
    nameEn: 'Production Engineering',
  },
  { code: 'CHM', nameAr: 'الهندسة الكيميائية', nameEn: 'Chemical Engineering' },
  {
    code: 'ARC',
    nameAr: 'الهندسة المعمارية',
    nameEn: 'Architectural Engineering',
  },
  { code: 'CIV', nameAr: 'الهندسة المدنية', nameEn: 'Civil Engineering' },
  { code: 'PET', nameAr: 'هندسة البترول', nameEn: 'Petroleum Engineering' },
  { code: 'MIN', nameAr: 'هندسة المناجم', nameEn: 'Mining Engineering' },
  {
    code: 'MET',
    nameAr: 'هندسة الفلزات والمعادن',
    nameEn: 'Metallurgical Engineering',
  },
];

export default function StudentSubmissionPortal() {
  const [isArabic, setIsArabic] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    gpa: '',
    firstChoice: '',
    secondChoice: '',
    thirdChoice: '',
    fourthChoice: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (formData.fullName.trim().length < 5) {
      setErrorMsg(
        isArabic
          ? 'الرجاء إدخال الاسم الكامل للطالب ثلاثي أو رباعي'
          : 'Please enter a valid full name.'
      );
      return;
    }

    const gpaNum = parseFloat(formData.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
      setErrorMsg(
        isArabic
          ? 'يجب أن يكون المعدل (GPA) بين 0.00 و 4.00'
          : 'GPA must be between 0.00 and 4.00'
      );
      return;
    }

    const uniqueChoices = new Set([
      formData.firstChoice,
      formData.secondChoice,
      formData.thirdChoice,
      formData.fourthChoice,
    ]);

    if (uniqueChoices.has('') || uniqueChoices.size < 4) {
      setErrorMsg(
        isArabic
          ? 'خطأ: يجب اختيار قسم مختلف لكل رغبة من الرغبات الأربعة!'
          : 'Error: All four choices must be unique and selected!'
      );
      return;
    }

    setSuccessMsg(
      isArabic
        ? 'تم تسجيل رغباتك الأربعة بنجاح من بين الأقسام الـ 13 المتاحة للكلية!'
        : 'Your 4 preferences have been submitted successfully from the 13 available departments!'
    );
    setFormData({
      fullName: '',
      gpa: '',
      firstChoice: '',
      secondChoice: '',
      thirdChoice: '',
      fourthChoice: '',
    });
  };

  return (
    <div
      className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-md p-8">
        <button
          type="button"
          onClick={() => setIsArabic(!isArabic)}
          className="mb-6 text-xs font-bold underline text-blue-600 hover:text-blue-800 block border-none bg-transparent cursor-pointer"
        >
          {isArabic ? 'Switch to English 🌐' : 'التغيير للغة العربية 🌐'}
        </button>

        <h1 className="text-2xl font-black text-slate-800 mb-2">
          {isArabic
            ? 'بوابة تنسيق رغبات الطلاب - كلية الهندسة'
            : 'Faculty of Engineering - Student Portal'}
        </h1>
        <p className="text-sm text-slate-500 mb-6 border-b pb-4">
          {isArabic
            ? 'الكلية توفر 13 قسماً علمياً، مطلوب منك اختيار وترتيب أهم 4 رغبات فقط حسب أولوياتك.'
            : 'The college offers 13 academic departments. You are required to select and rank your top 4 preferences only.'}
        </p>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg mb-6 font-medium">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg mb-6 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">
              {isArabic ? 'الاسم الكامل للطالب:' : 'Student Full Name:'}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-md p-2.5 text-slate-800"
              placeholder="اكتب اسمك رباعي"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">
              {isArabic ? 'المعدل التراكمي (GPA):' : 'Cumulative GPA:'}
            </label>
            <input
              type="number"
              step="0.01"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-md p-2.5 text-slate-800"
              placeholder="3.85"
            />
          </div>

          {['firstChoice', 'secondChoice', 'thirdChoice', 'fourthChoice'].map(
            (choiceKey, index) => (
              <div key={choiceKey}>
                <label className="block text-sm font-bold mb-1 text-slate-700">
                  {isArabic
                    ? `الرغبة رقم (${index + 1}):`
                    : `Priority Option #${index + 1}:`}
                </label>
                <select
                  name={choiceKey}
                  value={(formData as any)[choiceKey]}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 bg-white rounded-md p-2.5 text-slate-800"
                >
                  <option value="">
                    {isArabic
                      ? '-- اختر قسماً من الـ 13 قسم المتاحة --'
                      : '-- Select Department --'}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.code} value={dept.code}>
                      {isArabic ? dept.nameAr : dept.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-sm cursor-pointer"
          >
            {isArabic
              ? 'حفظ وتأكيد الرغبات الأربعة نهائياً'
              : 'Submit & Confirm Your 4 Choices'}
          </button>
        </form>
      </div>
    </div>
  );
}