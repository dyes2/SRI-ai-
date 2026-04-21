import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Check, 
  ChevronDown, 
  Search, 
  Sparkles, 
  LogIn, 
  ClipboardCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EvaluationStage, ApplicantScore, Judge, StageType, Application } from '../types';

// Mock Constants (Linking with Admin)
const INITIAL_JOBS = [
  { id: 'JOB-2024-001', title: '2024년 하반기 연구직(수습) 공개채용', category: '연구직' },
  { id: 'JOB-2024-002', title: '행정직원 및 공무직 상시채용', category: '행정직' },
];

export default function JudgePortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentJudge, setCurrentJudge] = useState<Judge | null>(null);
  const [judgeIdInput, setJudgeIdInput] = useState('');
  
  // States synced with Admin via LocalStorage
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [scores, setScores] = useState<ApplicantScore[]>([]);
  const [stages, setStages] = useState<Record<string, EvaluationStage[]>>({});

  // Local UI States
  const [evaluatingApplicantId, setEvaluatingApplicantId] = useState<string | null>(null);
  const [evalForm, setEvalForm] = useState<{
    isEligible: boolean;
    scores: Record<string, number>;
    bonusRate: 0 | 5 | 10;
    comment: string;
  }>({
    isEligible: true,
    scores: {},
    bonusRate: 0,
    comment: ''
  });
  const [isSignPopupOpen, setIsSignPopupOpen] = useState(false);
  const [isSignAgreed, setIsSignAgreed] = useState(false);

  useEffect(() => {
    const syncData = () => {
      const savedAnnouncements = localStorage.getItem('ATS_ANNOUNCEMENTS');
      const savedApplicants = localStorage.getItem('ATS_APPLICANTS');
      const savedScores = localStorage.getItem('ATS_SCORES');
      const savedStages = localStorage.getItem('ATS_STAGES');
      if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
      if (savedApplicants) setApplicants(JSON.parse(savedApplicants));
      if (savedScores) setScores(JSON.parse(savedScores));
      if (savedStages) setStages(JSON.parse(savedStages));
    };

    syncData();
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Search for judge in any stage configuration
    let foundJudge: Judge | null = null;
    Object.values(stages).forEach((jobStages: EvaluationStage[]) => {
      jobStages.forEach(stage => {
        const judge = stage.judges.find(j => j.id === judgeIdInput || j.name === judgeIdInput);
        if (judge) foundJudge = judge;
      });
    });

    if (foundJudge) {
      setCurrentJudge(foundJudge);
      setIsLoggedIn(true);
    } else {
      alert('등록되지 않은 심사위원 정보입니다. (테스트용: 홍길동 또는 J1 입력)');
    }
  };

  const startEvaluation = (applicantId: string, jobId: string, stageType: StageType) => {
    const existing = scores.find(s => 
      s.applicantId === applicantId && 
      s.judgeId === currentJudge?.id && 
      s.stageType === stageType
    );

    if (existing) {
      setEvalForm({
        isEligible: existing.isEligible,
        scores: { ...existing.scores },
        bonusRate: existing.bonusRate,
        comment: existing.comment || ''
      });
    } else {
      const initialScores: Record<string, number> = {};
      const criteria = stages[jobId]?.find(s => s.type === stageType)?.criteria || [];
      criteria.forEach(c => { initialScores[c.id] = 0; });
      
      setEvalForm({
        isEligible: true,
        scores: initialScores,
        bonusRate: 0,
        comment: ''
      });
    }
    setEvaluatingApplicantId(applicantId);
  };

  const finalSubmit = () => {
    if (!currentJudge || !evaluatingApplicantId) return;

    // Determine current job and stage from context
    // In a real app, this would be passed explicitly. Here we infer from the active evaluation.
    const activeMapping = assignedApplicants.find(a => a.id === evaluatingApplicantId);
    if (!activeMapping) return;

    const newScore: ApplicantScore = {
        applicantId: evaluatingApplicantId,
        stageType: activeMapping.stageType,
        judgeId: currentJudge.id,
        scores: { ...evalForm.scores },
        isEligible: evalForm.isEligible,
        bonusRate: evalForm.bonusRate,
        comment: evalForm.comment,
        status: 'SIGNED',
        signedAt: new Date().toLocaleString(),
        signedBy: currentJudge.name,
        ipAddress: '121.254.***.***'
    };

    const updatedScores = [
        ...scores.filter(s => !(s.applicantId === evaluatingApplicantId && s.judgeId === currentJudge.id && s.stageType === activeMapping.stageType)),
        newScore
    ];
    
    setScores(updatedScores);
    localStorage.setItem('ATS_SCORES', JSON.stringify(updatedScores));
    
    setIsSignPopupOpen(false);
    setEvaluatingApplicantId(null);
    setIsSignAgreed(false);
  };

  // Filter applicants assigned to this judge
  const assignedApplicants = applicants.flatMap(applicant => {
    const jobStages = stages[applicant.jobId] || [];
    return jobStages.flatMap(stage => {
      const isAssigned = stage.judges.some(j => j.id === currentJudge?.id);
      if (isAssigned) {
        const score = scores.find(s => s.applicantId === applicant.id && s.judgeId === currentJudge?.id && s.stageType === stage.type);
        return [{ ...applicant, stageType: stage.type, stageTitle: stage.title, evaluationStatus: score?.status || 'PENDING' }];
      }
      return [];
    });
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="p-10 text-center space-y-4">
             <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <LogIn className="w-10 h-10 text-primary" />
             </div>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight">심사위원 전용 포털</h1>
             <p className="text-slate-400 text-sm font-medium">배정받으신 공고의 심사를 위해 <br/>성함 또는 심사위원 ID를 입력해주세요.</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-10 pt-0 space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">심사위원 인증</label>
                <input 
                  type="text" 
                  value={judgeIdInput}
                  onChange={(e) => setJudgeIdInput(e.target.value)}
                  placeholder="예: 홍길동 또는 J1"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  required
                />
             </div>
             <button 
               type="submit"
               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
             >
                심사 시스템 접속
             </button>
             <p className="text-center text-[10px] text-slate-300 font-bold">© 수원시정연구원 채용 관리 시스템</p>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black">
                 SR
              </div>
              <div>
                <h1 className="font-black text-slate-800 tracking-tight">심사위원 포털</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suwon Research Institute</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-black text-slate-800">{currentJudge?.name} 위원님</p>
                 <p className="text-[10px] font-bold text-slate-400">{currentJudge?.affiliation} · {currentJudge?.position}</p>
              </div>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                 로그아웃
              </button>
           </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 py-12 space-y-12">
         <header className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <ClipboardCheck className="w-8 h-8 text-primary" />
               심사 대상 지원자 목록
            </h2>
            <p className="text-slate-400 text-sm font-medium">위원님께 배정된 실시간 지원자 목록입니다. 공정한 심사를 부탁드립니다.</p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedApplicants.map((applicant) => (
               <motion.div 
                 key={`${applicant.id}-${applicant.stageType}`}
                 whileHover={{ y: -5 }}
                 className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="relative space-y-6">
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border",
                            applicant.evaluationStatus === 'SIGNED' ? "bg-green-500 text-white border-green-400" : "bg-white text-slate-400 border-slate-100"
                          )}>
                             {applicant.evaluationStatus === 'SIGNED' ? <Check className="w-6 h-6" /> : applicant.name[0]}
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-800">{applicant.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{applicant.id}</p>
                          </div>
                       </div>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                         applicant.evaluationStatus === 'SIGNED' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                       )}>
                         {applicant.evaluationStatus === 'SIGNED' ? '평가 완료' : '평가 대기'}
                       </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">지원 공고</p>
                          <p className="text-xs font-bold text-slate-600">
                             {(announcements.find(j => j.id === applicant.jobId) || INITIAL_JOBS.find(j => j.id === applicant.jobId))?.title}
                          </p>
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">심사 전형</p>
                          <p className="text-xs font-black text-primary">{applicant.stageTitle}</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => startEvaluation(applicant.id, applicant.jobId, applicant.stageType)}
                      disabled={applicant.evaluationStatus === 'SIGNED'}
                      className={cn(
                        "w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2",
                        applicant.evaluationStatus === 'SIGNED' 
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                          : "bg-primary text-white shadow-xl shadow-primary/20 hover:bg-secondary"
                      )}
                    >
                       {applicant.evaluationStatus === 'SIGNED' ? '심사 완료됨' : '심사 시작하기'}
                    </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </main>

      {/* Evaluation Modal (Standalone) */}
      <AnimatePresence>
        {evaluatingApplicantId && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-end">
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
             >
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl">
                      {applicants.find(a => a.id === evaluatingApplicantId)?.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        {applicants.find(a => a.id === evaluatingApplicantId)?.name} 심사 진행
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {assignedApplicants.find(a => a.id === evaluatingApplicantId)?.stageTitle}
                         </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEvaluatingApplicantId(null)}
                    className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-200"
                  >
                    <ChevronDown className="w-6 h-6 rotate-90" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">01</div>
                       <h4 className="font-bold text-slate-800">자격 판단</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                           <div>
                              <p className="text-sm font-bold text-slate-700">공통 및 응시 자격 확인</p>
                              <p className="text-[10px] text-slate-400 font-medium">거주지, 학위, 전공 등 필수 요건 적격 여부</p>
                           </div>
                           <div className="flex gap-2">
                             {[
                               { v: true, label: '적격', color: 'blue' },
                               { v: false, label: '부적격', color: 'red' }
                             ].map(item => (
                               <button 
                                key={item.label}
                                onClick={() => setEvalForm(prev => ({ ...prev, isEligible: item.v }))}
                                className={cn(
                                  "px-6 py-2 rounded-xl text-xs font-black transition-all border-2",
                                  evalForm.isEligible === item.v 
                                    ? item.color === 'blue' ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                               >
                                 {item.label}
                               </button>
                             ))}
                           </div>
                        </div>
                    </div>
                  </section>

                  <section className={cn("space-y-6 transition-opacity duration-300", !evalForm.isEligible && "opacity-30 pointer-events-none")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">02</div>
                         <h4 className="font-bold text-slate-800">정성/정량 점수 평가</h4>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                       {stages[assignedApplicants.find(a => a.id === evaluatingApplicantId)?.jobId || '']
                          ?.find(s => s.type === assignedApplicants.find(a => a.id === evaluatingApplicantId)?.stageType)
                          ?.criteria.map(c => (
                         <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group focus-within:border-primary/30 transition-all">
                            <div className="flex-1">
                               <p className="text-sm font-bold text-slate-700">{c.label}</p>
                               <p className="text-[10px] text-slate-400 font-medium">최대 {c.maxScore}점</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <input 
                                  type="number" 
                                  min="0" 
                                  max={c.maxScore}
                                  value={evalForm.scores[c.id] || 0}
                                  onChange={(e) => {
                                      const val = Math.min(c.maxScore, Math.max(0, parseInt(e.target.value) || 0));
                                      setEvalForm(prev => ({
                                          ...prev,
                                          scores: { ...prev.scores, [c.id]: val }
                                      }));
                                  }}
                                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                                <span className="text-xs font-bold text-slate-300">/ {c.maxScore}</span>
                            </div>
                         </div>
                       ))}
                       <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                          <p className="font-bold text-primary">평가 점수 합계</p>
                          <p className="text-2xl font-black text-primary">
                             {Object.values(evalForm.scores).reduce((a: number, b: number) => a + b, 0)}
                          </p>
                       </div>
                    </div>
                  </section>

                  <section className={cn("space-y-6 transition-opacity duration-300", !evalForm.isEligible && "opacity-30 pointer-events-none")}>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">03</div>
                       <h4 className="font-bold text-slate-800">가산점 및 종합 의견</h4>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex gap-2">
                          {[0, 5, 10].map(v => (
                            <button 
                              key={v}
                              onClick={() => setEvalForm(prev => ({ ...prev, bonusRate: v as any }))}
                              className={cn(
                                "flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all",
                                evalForm.bonusRate === v 
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                              )}
                            >
                              {v === 0 ? '없음' : `${v}% 가산`}
                            </button>
                          ))}
                       </div>
                       <textarea 
                         value={evalForm.comment}
                         onChange={(e) => setEvalForm(prev => ({ ...prev, comment: e.target.value }))}
                         placeholder="지원자에 대한 종합 평가 의견을 작성하세요..."
                         className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[140px] resize-none"
                       />
                    </div>
                  </section>
               </div>

               <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => setEvaluatingApplicantId(null)}
                    className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-400 hover:bg-white/50 transition-all"
                  >
                    닫기
                  </button>
                  <button 
                    onClick={() => setIsSignPopupOpen(true)}
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    심사 완료 및 서명하기
                  </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Confirmation Popup */}
      <AnimatePresence>
        {isSignPopupOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden"
               >
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 text-center">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 tracking-tight">심사위원 확인 및 서명</h3>
                  </div>
                  
                  <div className="p-8 space-y-6">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500 leading-relaxed text-center">
                        "본인은 해당 평가가 본인의 전문적 판단과 양심에 따라 공정하게 이루어졌음을 확인하며, 이에 서명합니다."
                     </div>
                     
                     <div className="flex items-center justify-between px-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">서명자</p>
                        <p className="text-lg font-black text-slate-800">
                            {currentJudge?.name} (인)
                        </p>
                     </div>

                     <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-primary/5 transition-all">
                        <input 
                          type="checkbox" 
                          checked={isSignAgreed}
                          onChange={(e) => setIsSignAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 leading-tight">위 내용을 충분히 확인하였으며, 최종 제출에 동의합니다.</span>
                     </label>
                  </div>

                  <div className="p-8 bg-slate-50 flex gap-3">
                     <button 
                       onClick={() => setIsSignPopupOpen(false)}
                       className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-all"
                     >
                        취소
                     </button>
                     <button 
                       onClick={finalSubmit}
                       disabled={!isSignAgreed}
                       className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 disabled:bg-slate-200 disabled:shadow-none transition-all"
                     >
                        서명 및 최종 제출
                     </button>
                  </div>
               </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
