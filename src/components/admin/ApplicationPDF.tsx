import React from 'react';
import { format } from 'date-fns';

interface ApplicationPDFProps {
  applicant: {
    id: string;
    name: string;
    job: string;
    email: string;
    date: string;
  };
}

export const ApplicationPDF = React.forwardRef<HTMLDivElement, ApplicationPDFProps>(({ applicant }, ref) => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div 
      ref={ref} 
      className="bg-white text-slate-900 p-[20mm] w-[210mm] min-h-[297mm] mx-auto shadow-none font-sans print:p-0"
      style={{ boxSizing: 'border-box' }}
    >
      {/* 1. Cover Page */}
      <div className="h-[257mm] flex flex-col items-center justify-center border-4 border-double border-slate-200 p-12 mb-[40mm]">
        <h1 className="text-4xl font-black mb-16 text-slate-800 tracking-tight">수원시정연구원 채용 지원서</h1>
        
        <div className="w-full max-w-sm space-y-6 mt-20">
          <div className="flex border-b border-slate-200 pb-2">
            <span className="w-32 font-bold text-slate-500 uppercase tracking-widest text-sm">지원자</span>
            <span className="text-xl font-bold">{applicant.name}</span>
          </div>
          <div className="flex border-b border-slate-200 pb-2">
            <span className="w-32 font-bold text-slate-500 uppercase tracking-widest text-sm">지원분야</span>
            <span className="text-xl font-bold">{applicant.job}</span>
          </div>
          <div className="flex border-b border-slate-200 pb-2">
            <span className="w-32 font-bold text-slate-500 uppercase tracking-widest text-sm">생성일</span>
            <span className="text-xl font-bold text-slate-600">{today}</span>
          </div>
        </div>

        <div className="mt-auto opacity-50 text-xs font-bold tracking-widest">
          SUWON RESEARCH INSTITUTE
        </div>
      </div>

      <div className="break-after-page" />

      {/* 2. Summary Page */}
      <div className="min-h-[297mm] py-10 space-y-12">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">⭐ 지원 내역 요약</h2>
          <span className="text-xs font-bold text-slate-400">Page 2</span>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            지원자 요약
          </h3>
          <div className="grid grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">이름</p>
              <p className="font-bold text-lg">{applicant.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">전공</p>
              <p className="font-bold text-lg">행정학 (석사)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">최종경력</p>
              <p className="font-bold text-lg">도시정책연구 5년</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            핵심 요약 (Key Assessment)
          </h3>
          <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
            <div className="p-4 flex gap-4">
              <span className="shrink-0 w-24 font-bold text-primary text-sm">연구실적</span>
              <p className="text-sm text-slate-600">정책보고서 5건 발간, 국내외 학술지 논문 게재 3건 등 우수 실적 보유</p>
            </div>
            <div className="p-4 flex gap-4">
              <span className="shrink-0 w-24 font-bold text-primary text-sm">강점역량</span>
              <p className="text-sm text-slate-600">R 및 Python을 이용한 고도화된 데이터 기반 정책 분석 및 시각화 경험 풍부</p>
            </div>
            <div className="p-4 flex gap-4">
              <span className="shrink-0 w-24 font-bold text-primary text-sm">직무적합성</span>
              <p className="text-sm text-slate-600">수원시 스마트 도시 사업 계획 참여 경험으로 즉시 전력 투입 가능한 인재</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            자기소개 키워드
          </h3>
          <div className="flex gap-2">
            {['#정책연구', '#데이터분석', '#공공성', '#스마트도시', '#수원'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-xs border border-primary/10">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-auto pt-20 text-[10px] text-slate-400 font-bold flex justify-between items-center border-t border-slate-100">
           <span>수원시정연구원 내부자료 | Created: {today}</span>
           <span>Page 2 / 5</span>
        </div>
      </div>

      <div className="break-after-page" />

      {/* 3. Personal Info & Academic */}
      <div className="min-h-[297mm] py-10 space-y-12">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">■ 1. 인적사항 및 학력</h2>
          <span className="text-xs font-bold text-slate-400">Page 3</span>
        </div>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-900 border-l-4 border-slate-800 pl-3">기본 인적사항</h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm bg-slate-50 p-6 rounded-2xl">
            <div className="flex gap-4"><span className="w-20 font-bold text-slate-500">성명</span><span>{applicant.name}</span></div>
            <div className="flex gap-4"><span className="w-20 font-bold text-slate-500">생년월일</span><span>1990-01-01</span></div>
            <div className="flex gap-4"><span className="w-20 font-bold text-slate-500">이메일</span><span>{applicant.email}</span></div>
            <div className="flex gap-4"><span className="w-20 font-bold text-slate-500">연락처</span><span>010-1234-5678</span></div>
            <div className="col-span-2 flex gap-4 border-t border-slate-200 pt-3">
              <span className="w-20 font-bold text-slate-500">주소</span>
              <span>경기도 수원시 영통구 ... (상세 주소 마스킹 처리됨)</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-900 border-l-4 border-slate-800 pl-3">학력 사항 (Education)</h3>
          <table className="w-full border-collapse border border-slate-200 text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-200 p-2 text-center w-40">학교명</th>
                <th className="border border-slate-200 p-2 text-center">전공</th>
                <th className="border border-slate-200 p-2 text-center w-40">수업기간</th>
                <th className="border border-slate-200 p-2 text-center w-24">졸업여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-3 text-center font-bold">○○대학교 대학원</td>
                <td className="border border-slate-200 p-3 text-center">행정학 (도시정책 전공)</td>
                <td className="border border-slate-200 p-3 text-center">2014.03 ~ 2016.02</td>
                <td className="border border-slate-200 p-3 text-center">석사 졸업</td>
              </tr>
              <tr>
                <td className="border border-slate-200 p-3 text-center font-bold">△△대학교</td>
                <td className="border border-slate-200 p-3 text-center">행정학</td>
                <td className="border border-slate-200 p-3 text-center">2010.03 ~ 2014.02</td>
                <td className="border border-slate-200 p-3 text-center">학사 졸업</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="mt-auto pt-20 text-[10px] text-slate-400 font-bold flex justify-between items-center border-t border-slate-100">
           <span>수원시정연구원 내부자료 | Created: {today}</span>
           <span>Page 3 / 5</span>
        </div>
      </div>

      <div className="break-after-page" />

      {/* 4. Research Achievements */}
      <div className="min-h-[297mm] py-10 space-y-12">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">■ 2. 주요 연구실적</h2>
          <span className="text-xs font-bold text-slate-400">Page 4</span>
        </div>

        <div className="space-y-8">
           {[
             { 
               title: '수원 스마트 시티 고도화 전략 연구', 
               role: '책임연구원', 
               year: '2023',
               content: '기존 스마트 도시 인프라를 활용하여 노년층 디지털 소외를 해결하기 위한 정책 보고서 발간. 실제 시정 과제로 채택되어 예산 편성됨.' 
             },
             { 
               title: '경기 남부권 도시 경쟁력 분석 보고서', 
               role: '참여연구원', 
               year: '2022',
               content: '인구 흐름 데이터 분석을 통해 수원시의 거점 도시화 전략 수립. 데이터 분석 파트 총괄 담당.' 
             },
             { 
               title: '공공 서비스 전달 체계 개선을 위한 실질적 고찰', 
               role: '제1저자(KCI)', 
               year: '2021',
               content: '공공기관의 효율적 업무 수행을 위한 제도적 개선안 논문 게재.' 
             }
           ].map((item, idx) => (
             <div key={idx} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
               <div className="flex justify-between items-start mb-3">
                 <h4 className="text-base font-bold text-slate-800">[대표 연구 {idx + 1}] {item.title}</h4>
                 <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-primary">{item.year}</span>
               </div>
               <div className="grid grid-cols-4 gap-4 text-[11px] mb-4">
                 <div className="flex gap-2"><span className="text-slate-400 font-bold">역할</span><span className="font-bold">{item.role}</span></div>
                 <div className="flex gap-2"><span className="text-slate-400 font-bold">기간</span><span className="font-bold">12개월</span></div>
               </div>
               <div className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-400 text-[10px] block mb-1">주요 수행내용 및 성과</span>
                  {item.content}
               </div>
             </div>
           ))}
           <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl text-center text-[11px] text-slate-400 font-bold">
             기타 연구실적 5건 추가 보유 (목록은 원본 데이터 참고)
           </div>
        </div>

        <div className="mt-auto pt-20 text-[10px] text-slate-400 font-bold flex justify-between items-center border-t border-slate-100">
           <span>수원시정연구원 내부자료 | Created: {today}</span>
           <span>Page 4 / 5</span>
        </div>
      </div>

      <div className="break-after-page" />

      {/* 5. Self Intro & Plan */}
      <div className="min-h-[297mm] py-10 space-y-12">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <h2 className="text-2xl font-black tracking-tight">■ 3. 자기소개 및 직무계획</h2>
          <span className="text-xs font-bold text-slate-400">Page 5</span>
        </div>

        <section className="space-y-6">
          <h3 className="font-bold text-slate-900 border-l-4 border-slate-800 pl-3">자기소개서 (핵심 발췌)</h3>
          <div className="space-y-6">
             <div>
               <p className="text-xs font-black text-slate-400 mb-2">[1] 지원동기 및 포부</p>
               <div className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl">
                 수원시의 밝은 미래를 위해 정책적 혁신을 도모하고 싶습니다. 지난 5년간의 데이터를 기반으로 한 연구 경험을 통해 최적의 시정 대안을 제시하겠습니다.
               </div>
             </div>
             <div>
               <p className="text-xs font-black text-slate-400 mb-2">[2] 주요 직무 전문성</p>
               <div className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl">
                 공공 데이터 포털의 빅데이터를 분석하여 도시 문제를 진단하고, 이를 지표화하여 정책에 반영한 경험이 저의 핵심 강점입니다.
               </div>
             </div>
          </div>
        </section>

        <section className="space-y-6 pt-6">
          <h3 className="font-bold text-slate-900 border-l-4 border-slate-800 pl-3 text-lg">■ 4. 직무수행계획서 (Summary)</h3>
          <div className="bg-primary/[0.03] border-2 border-primary/10 rounded-2xl p-6 space-y-6">
            <div>
              <h5 className="text-sm font-bold text-primary mb-2">1. 단기 목표 (임용 후 6개월)</h5>
              <p className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-primary/20">
                수원시 당면 과제인 '디지털 격차 해소' 실태 조사를 과업 기간 내 완료하고 정책 제안서 초안 마련
              </p>
            </div>
            <div>
              <h5 className="text-sm font-bold text-primary mb-2">2. 중장기 목표 (1년 이후)</h5>
              <p className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-primary/20">
                수원형 스마트도시 인덱스 플랫폼 구축 및 자립형 연구 모델 성립으로 외부 수탁 과제 연간 2건 이상 수주
              </p>
            </div>
          </div>
        </section>

        <div className="mt-auto pt-20 text-[10px] text-slate-400 font-bold flex justify-between items-center border-t border-slate-100">
           <span>수원시정연구원 내부자료 | Created: {today}</span>
           <span>Page 5 / 5</span>
        </div>
      </div>
    </div>
  );
});

ApplicationPDF.displayName = 'ApplicationPDF';
