import React from 'react';
import { format } from 'date-fns';

interface SummaryPDFProps {
  jobTitle: string;
  applicants: any[];
  isBlind: boolean;
  type: 'LIST' | 'DETAIL';
}

export const SummaryPDF = React.forwardRef<HTMLDivElement, SummaryPDFProps>(({ jobTitle, applicants, isBlind, type }, ref) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Mock stats for summary
  const eduStats = {
    bachelor: applicants.filter((_, i) => i % 3 === 0).length,
    master: applicants.filter((_, i) => i % 3 === 1).length,
    doctor: applicants.filter((_, i) => i % 3 === 2).length,
  };

  const majorStats = {
    admin: applicants.filter((_, i) => i % 2 === 0).length,
    urban: applicants.filter((_, i) => i % 2 === 1).length,
  };

  const maskName = (name: string, index: number) => {
    return isBlind ? `지원자 ${index + 1}` : name;
  };

  const maskBirth = (date: string) => {
    return isBlind ? date.split('-')[0] : date;
  };

  return (
    <div 
      ref={ref} 
      className="bg-white text-slate-900 p-[20mm] w-[210mm] min-h-[297mm] mx-auto shadow-none font-sans"
      style={{ boxSizing: 'border-box' }}
    >
      {/* 1. Cover Page */}
      <div className="h-[257mm] flex flex-col items-center justify-center border-8 border-double border-slate-100 p-12 mb-[40mm]">
        <div className="text-center space-y-4 mb-20">
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-sm">SUWON RESEARCH INSTITUTE</p>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
            수원시정연구원<br />채용 지원자 현황 보고서
          </h1>
        </div>
        
        <div className="w-full max-w-sm space-y-6 bg-slate-50 p-8 rounded-3xl">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-400 text-sm">채용분야</span>
            <span className="font-extrabold text-slate-800">{jobTitle}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-400 text-sm">총 지원자</span>
            <span className="font-extrabold text-slate-800">{applicants.length}명</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-400 text-sm">생성일</span>
            <span className="font-extrabold text-slate-800">{today}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-slate-400 text-sm">출력구분</span>
            <span className="font-extrabold text-primary">{isBlind ? '블라인드 처리됨' : '일반 출력'}</span>
          </div>
        </div>

        <div className="mt-auto text-[10px] font-bold text-slate-300">
          본 문서는 채용 심사 위원회 회의용 자료입니다. 외부 유출을 금합니다.
        </div>
      </div>

      <div className="break-after-page" />

      {/* 2. Overall Summary Page */}
      <div className="min-h-[257mm] py-10 space-y-12">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">전체 현황 요약</h2>
          <span className="text-xs font-bold text-slate-400">Page 2</span>
        </div>

        <div className="grid grid-cols-2 gap-8">
           <section className="space-y-4 bg-slate-50 p-6 rounded-2xl">
             <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">학력 분포 (Education)</h3>
             <ul className="space-y-3">
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">박사 학위자</span>
                 <span className="text-xl font-black text-primary">{eduStats.doctor}명</span>
               </li>
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">석사 학위자</span>
                 <span className="text-xl font-black text-primary">{eduStats.master}명</span>
               </li>
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">학사 학위자</span>
                 <span className="text-xl font-black text-primary">{eduStats.bachelor}명</span>
               </li>
             </ul>
           </section>

           <section className="space-y-4 bg-slate-50 p-6 rounded-2xl">
             <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">전공 분포 (Majors)</h3>
             <ul className="space-y-3">
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">행정학 / 정책학</span>
                 <span className="text-xl font-black text-secondary">{majorStats.admin}명</span>
               </li>
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">도시계획 / 환경</span>
                 <span className="text-xl font-black text-secondary">{majorStats.urban}명</span>
               </li>
               <li className="flex justify-between items-end">
                 <span className="text-sm font-bold">기타 전문분야</span>
                 <span className="text-xl font-black text-secondary">{applicants.length - majorStats.admin - majorStats.urban}명</span>
               </li>
             </ul>
           </section>
        </div>

        <section className="space-y-4">
           <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">데이터 시각화 (Mock)</h3>
           <div className="h-40 bg-slate-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase">학력 및 전공 분포 차트 영역</p>
           </div>
        </section>

        <div className="mt-auto pt-20 text-[10px] text-slate-400 font-bold flex justify-between items-center border-t border-slate-100">
           <span>수원시정연구원 | 채용분야: {jobTitle}</span>
           <span>Page 2 / Total</span>
        </div>
      </div>

      <div className="break-after-page" />

      {/* 3. Applicant List Table */}
      <div className="min-h-[257mm] py-10 space-y-8">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">지원자 인적사항 목록</h2>
          <span className="text-xs font-bold text-slate-400">Page 3</span>
        </div>

        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-100 border-t-2 border-slate-800">
              <th className="border border-slate-200 p-2 text-center w-12">No</th>
              <th className="border border-slate-200 p-2 text-center w-24">이름</th>
              <th className="border border-slate-200 p-2 text-center w-24">생년월일</th>
              <th className="border border-slate-200 p-2 text-center">이메일</th>
              <th className="border border-slate-200 p-2 text-center w-28">최종학력</th>
              <th className="border border-slate-200 p-2 text-center w-28">전공</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a, i) => (
              <tr key={a.id} className="border-b border-slate-100">
                <td className="border border-slate-200 p-2 text-center font-mono">{i + 1}</td>
                <td className="border border-slate-200 p-2 text-center font-bold">{maskName(a.name, i)}</td>
                <td className="border border-slate-200 p-2 text-center">{maskBirth(a.date)}</td>
                <td className="border border-slate-200 p-2 text-center">{isBlind ? '비공개' : a.email}</td>
                <td className="border border-slate-200 p-2 text-center font-bold">
                   {i % 3 === 0 ? '학사' : i % 3 === 1 ? '석사' : '박사'}
                </td>
                <td className="border border-slate-200 p-2 text-center">{i % 2 === 0 ? '행정학' : '도시계획'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="break-after-page" />

      {/* 4. Individual Summaries (If type is DETAIL) */}
      {type === 'DETAIL' && (
        <div className="py-10 space-y-12">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
            <h2 className="text-2xl font-black tracking-tight">지원자별 상세 요약</h2>
            <span className="text-xs font-bold text-slate-400">Page 4 ~</span>
          </div>

          <div className="space-y-12">
            {applicants.map((a, i) => (
              <div key={a.id} className="relative p-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] break-inside-avoid">
                <div className="absolute top-8 right-8 text-4xl font-black text-slate-200">No.{i + 1}</div>
                
                <header className="flex items-end gap-4 mb-8">
                  <h3 className="text-3xl font-black text-slate-800">{maskName(a.name, i)}</h3>
                  {!isBlind && <span className="text-sm font-bold text-slate-400 mb-1">{a.email}</span>}
                </header>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1">기본 정보</h4>
                    <ul className="text-sm font-bold space-y-2">
                      <li className="flex justify-between"><span className="text-slate-400">생년월일</span><span>{maskBirth(a.date)}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">학력</span><span>○○대학 {i % 2 === 0 ? '행정학' : '도시계획'} ({i % 3 === 1 ? '석사' : '박사'})</span></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest border-b border-secondary/20 pb-1">연구실적 요약</h4>
                    <ul className="text-xs font-bold space-y-2 text-slate-600">
                      <li>• 정책보고서 {3 + (i%3)}건 발간</li>
                      <li>• KCI 등재 학술지 2건 게재</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">자기소개 키워드</h4>
                   <div className="flex gap-2">
                      {['#정책전문가', '#데이터기반', '#도시수원'].map(k => (
                        <span key={k} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
                           {k}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

SummaryPDF.displayName = 'SummaryPDF';
