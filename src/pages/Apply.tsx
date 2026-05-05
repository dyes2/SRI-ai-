import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Send, 
  AlertCircle,
  FileUp,
  Trash2,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useJob } from '../context/JobContext';
import { getComputedJobStatus } from '../lib/jobUtils';

const STEPS = [
  '기본정보', 
  '학력/역량', 
  '자기소개서', 
  '직무계획', 
  '증빙제출', 
  '최종확인'
];

export default function Apply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, setApplicants } = useJob();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const job = jobs.find(j => j.id === jobId);
  const computedStatus = job ? getComputedJobStatus(job) : null;

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(`apply-draft-${jobId}`);
    return saved ? JSON.parse(saved) : {
      personal: { name: '', birthday: '', phone: '', email: '', address: '', password: '' },
      education: [{ school: '', major: '', period: '' }],
      experience: [],
      research: [],
      intro: { motive: '', capability: '', experience: '', suitability: '' },
      plan: { text: '', aiHelper: false },
      attachments: []
    };
  });

  // Redirect or show error if job is not accepting applications
  if (!job || computedStatus !== 'ONGOING') {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">지원이 불가능한 공고입니다</h2>
          <p className="text-slate-500">
            {!job ? '해당 공고를 찾을 수 없습니다.' : 
             computedStatus === 'UPCOMING' ? '아직 모집 시작 전인 공고입니다.' : 
             '접수 기간이 종료된 공고입니다.'}
          </p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // Auto-save effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(`apply-draft-${jobId}`, JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData, jobId]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      window.scrollTo(0, 0);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!job) return;
    setIsSaving(true);
    
    // Create new applicant object
    const newId = `${new Date().getFullYear()}-${jobId?.split('-').pop()}-${Math.floor(100 + Math.random() * 899)}`;
    const newApplicant = {
      id: newId,
      name: formData.personal.name,
      email: formData.personal.email,
      jobId: jobId,
      job: job.category,
      status: '접수완료',
      date: new Date().toISOString().split('T')[0],
      isNew: true,
      data: {
        personal: { ...formData.personal },
        intro: { ...formData.intro },
        plan: {
          direction: formData.plan.text.length > 50 ? formData.plan.text.substring(0, 50) + '...' : formData.plan.text,
          utilization: '본인 경험 활용',
          contribution: '기관 발전 기여'
        },
        attachments: formData.attachments.length > 0 ? formData.attachments : ['지원서_증빙자료.pdf']
      }
    };

    // Simulate network delay
    setTimeout(() => {
      setApplicants(prev => [newApplicant, ...prev]);
      setIsSaving(false);
      alert('지원이 성공적으로 완료되었습니다!');
      localStorage.removeItem(`apply-draft-${jobId}`);
      navigate('/mypage');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative px-2">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 font-bold text-sm shadow-sm bg-white",
                  idx === currentStep ? "border-primary text-primary ring-4 ring-primary/10" :
                  idx < currentStep ? "border-green-500 bg-green-500 text-white" : "border-slate-200 text-slate-300"
                )}
              >
                {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest hidden sm:block",
                idx === currentStep ? "text-primary" : "text-slate-400"
              )}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bento-card p-8 md:p-12 shadow-md min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Step 1: Personal */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-2">기본 정보를 입력해주세요</h2>
                  <p className="text-slate-500 text-sm italic">연락처 및 이메일은 합격 안내 시 활용되므로 정확히 입력 바랍니다.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">성명</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.name}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, name: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">생년월일</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.birthday}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, birthday: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">연락처</label>
                    <input 
                      type="tel" 
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.phone}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, phone: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">이메일</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.email}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, email: e.target.value}})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">주소</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.address}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, address: e.target.value}})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">비밀번호 (조회용)</label>
                    <input 
                      type="password" 
                      placeholder="결과 조회 시 사용할 비밀번호를 입력해주세요"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.personal.password}
                      onChange={e => setFormData({...formData, personal: {...formData.personal, password: e.target.value}})}
                    />
                    <p className="text-[10px] text-slate-400 font-medium">※ 입력하신 비밀번호는 추후 합격 여부 및 지원서 조회 시 본인 인증에 사용됩니다.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education/Experience */}
            {currentStep === 1 && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">학력 사항</h3>
                    <button 
                      onClick={() => setFormData({...formData, education: [...formData.education, {school:'', major:'', period:''}]})}
                      className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> 추가하기
                    </button>
                  </div>
                  {formData.education.map((edu: any, idx: number) => (
                    <div key={idx} className="grid md:grid-cols-3 gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50 relative group">
                      <input 
                        placeholder="학교명" 
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                        value={edu.school}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[idx].school = e.target.value;
                          setFormData({...formData, education: newEdu});
                        }}
                      />
                      <input 
                        placeholder="전공" 
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                        value={edu.major}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[idx].major = e.target.value;
                          setFormData({...formData, education: newEdu});
                        }}
                      />
                      <input 
                        placeholder="재학기간 (YYYY.MM - YYYY.MM)" 
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                        value={edu.period}
                        onChange={e => {
                          const newEdu = [...formData.education];
                          newEdu[idx].period = e.target.value;
                          setFormData({...formData, education: newEdu});
                        }}
                      />
                      {idx > 0 && (
                        <button 
                          onClick={() => {
                            const newEdu = formData.education.filter((_: any, i: number) => i !== idx);
                            setFormData({...formData, education: newEdu});
                          }}
                          className="absolute -top-2 -right-2 bg-white border border-red-100 p-1 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="bg-amber-50 rounded-xl p-4 flex gap-3 text-amber-700">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium">※ 블라인드 채용 가이드에 따라 학교명 기재 시 편견을 줄 수 있는 정보는 유의하여 작성바랍니다. (본 시스템은 평가 시 학교명이 마스킹 처리됩니다)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">연구 실적 (논문/보고서 등)</h3>
                    <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> 추가하기
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs text-center py-8 border border-dashed border-slate-200 rounded-2xl">입력된 연구 실적이 없습니다.</p>
                </div>
              </div>
            )}

            {/* Step 3: Self-Intro */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">자기소개서</h2>
                  <p className="text-slate-500 text-sm">각 항목별 500자 내외로 작성해주시기 바랍니다.</p>
                </div>
                
                {[
                  { field: 'motive', label: '1. 지원동기 및 포부', placeholder: '수원시정연구원에 지원하게 된 배경과 앞으로의 기여 방향을 기술하십시오.' },
                  { field: 'capability', label: '2. 직무 역량 및 전문성', placeholder: '해당 직무를 수행하기 위한 본인만의 핵심 역량과 전문 지식을 기술하십시오.' },
                  { field: 'experience', label: '3. 주요 경험 및 성과', placeholder: '지금까지의 경험 중 가장 큰 성취를 이룬 사례를 구체적으로 성술하십시오.' },
                  { field: 'suitability', label: '4. 사회적 가치 및 공공성', placeholder: '공공기관 구성원으로서 갖춰야 할 태도와 본인의 가치관을 연계하여 기술하십시오.' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-sm font-bold text-slate-700">{item.label}</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(formData.intro[item.field as keyof typeof formData.intro] as string).length} / 1000 자
                      </span>
                    </div>
                    <textarea 
                      rows={5}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                      placeholder={item.placeholder}
                      value={formData.intro[item.field as keyof typeof formData.intro]}
                      onChange={e => setFormData({...formData, intro: {...formData.intro, [item.field]: e.target.value}})}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Plan */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">직무수행계획서</h2>
                    <p className="text-slate-500 text-sm">임용 시 본인의 연구/행정 수행 방향에 대해 자유롭게 기술하십시오.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                    AI 작성 도우미 보러가기
                  </button>
                </div>

                <div className="space-y-3 pt-4">
                  <textarea 
                    rows={12}
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm leading-relaxed"
                    placeholder="수원의 정책 방향에 부합하는 본인만의 연구 제안과 추진 방안을 수록해주십시오."
                    value={formData.plan.text}
                    onChange={e => setFormData({...formData, plan: {...formData.plan, text: e.target.value}})}
                  />
                  <div className="flex items-center gap-2 px-2">
                    <input type="checkbox" id="ai-check" className="accent-primary" />
                    <label htmlFor="ai-check" className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer">AI 보조 기능을 사용하여 작성 가이드를 받았습니다</label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Files */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">증빙자료 제출</h2>
                  <p className="text-slate-500 text-sm">졸업증명서, 경력증명서 등 모든 필수 서류를 업로드해주세요. (PDF 권장)</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-primary transition-colors cursor-pointer group bg-slate-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                      <FileUp className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700">파일을 드래그하거나 여기를 클릭하세요</p>
                      <p className="text-xs text-slate-400">PDF, JPG, PNG 형식 지원 (항목당 최대 10MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">업로드된 파일 목록</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center font-bold text-[10px] text-red-500">PDF</div>
                        <span className="text-sm font-medium">최종학력_졸업증명서_마스킹완료.pdf</span>
                      </div>
                      <button className="text-slate-300 hover:text-red-500 p-1 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Final */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">최종 제출 확인</h2>
                  <p className="text-red-500 text-sm font-semibold">제출 후에는 수정이 불가능하므로 반드시 내용을 다시 한번 확인해주시기 바랍니다.</p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6 border-b border-slate-200 pb-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">지원자명</p>
                      <p className="font-bold">{formData.personal.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">연락처</p>
                      <p className="font-bold">{formData.personal.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">첨부파일</p>
                      <p className="font-bold">1 건</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">작성상태</p>
                      <span className="inline-block px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">완료</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-700">개인정보 수집 및 이용 동의</p>
                    <div className="h-32 overflow-y-auto bg-white border border-slate-200 rounded-xl p-4 text-[11px] text-slate-500 leading-relaxed font-medium">
                      (재)수원시정연구원 채용과 관련하여 개인정보보호법 제15조 및 제22조에 따라 귀하의 개인정보를 수집·이용하고자 합니다.
                      1. 수집항목: 성명, 생년월일, 연락처, 주소, 학력, 경력 등
                      2. 수집목적: 채용 전형 진행 및 본인 확인
                      3. 보유기간: 채용 확정 후 5년간 보유 (탈락자 서류는 파기)
                      ...
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="consent" className="accent-primary" />
                      <label htmlFor="consent" className="text-sm font-bold text-primary cursor-pointer hover:underline underline-offset-4">위의 모든 사항을 확인하였으며 개인정보 제공에 동의합니다.</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors py-2"
              >
                <ChevronLeft className="w-4 h-4" /> 뒤로가기
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                alert('임시 저장이 완료되었습니다.');
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors group"
            >
              <Save className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
              임시저장
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-10 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                다음단계 
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-12 py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 shadow-xl shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isSaving ? '제출 중...' : '최종 제출하기'}
                {!isSaving && <Send className="w-5 h-5 ml-2" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
