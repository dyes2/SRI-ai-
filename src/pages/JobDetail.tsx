import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Download, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDotDate, cn } from '../lib/utils';
import { useJob } from '../context/JobContext';
import { getComputedJobStatus } from '../lib/jobUtils';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useJob();

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">공고를 찾을 수 없습니다</h2>
          <p className="text-slate-500">삭제되었거나 잘못된 접근입니다.</p>
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

  const computedStatus = getComputedJobStatus(job);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        목록으로 돌아가기
      </Link>

      <div className="bento-card">
        <div className="bg-slate-50 p-8 border-b border-slate-100">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              {job.category}
            </span>
            <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
              {job.type}
            </span>
            {computedStatus === 'CLOSED' && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                마감됨
              </span>
            )}
            {computedStatus === 'UPCOMING' && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                모집예정
              </span>
            )}
            {computedStatus === 'ONGOING' && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                모집중
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {job.title}
          </h1>
          
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="block text-[10px] uppercase font-bold text-slate-400">접수기간</span>
                <span className="font-semibold text-slate-700">
                  {formatDotDate(job.schedule?.postingPeriod.start)} ~ {formatDotDate(job.schedule?.postingPeriod.end)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="block text-[10px] uppercase font-bold text-slate-400">근무지</span>
                <span className="font-semibold text-slate-700">경기도 수원시</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="block text-[10px] uppercase font-bold text-slate-400">모집인원</span>
                <span className="font-semibold text-slate-700">{job.count}명</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: 주요 직무 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">주요 수행직무 및 자격요건</h2>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-sm text-primary mb-3">주요 수행직무</h3>
                  <div className="space-y-4">
                    {job.fields.map((field) => (
                      <div key={field.id} className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <p className="font-bold text-xs text-slate-800 mb-1">{field.name} ({field.slots}명)</p>
                        <p className="text-[11px] text-slate-500 mb-1">전공: {field.major}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{field.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary mb-3">지원 자격</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">공통 자격</p>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{job.qualifications.common}</p>
                    </div>
                    {job.qualifications.additional && (
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">분야별 추가 자격</p>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{job.qualifications.additional}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  <Download className="w-3 h-3 text-primary" />
                  직무기술서(JD) 다운로드 (PDF)
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: 전형 절차 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">전형절차</h2>
            <div className="relative pt-4 overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[600px]">
                {job.selectedStages.map((stageType, idx) => {
                  const titles: Record<string, string> = {
                    'DOCUMENT': '서류심사',
                    'INTERVIEW_1': '1차 면접',
                    'INTERVIEW_2': '2차 면접',
                    'INTERVIEW_PT': 'PT 면접'
                  };
                  return (
                    <div key={idx} className="flex-1 text-center space-y-2">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400 mx-auto z-10 relative bg-white">
                          O{idx + 1}
                        </div>
                        {idx < job.selectedStages.length - 1 && <div className="absolute top-1/2 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-slate-100 -translate-y-1/2" />}
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="font-bold text-sm">{titles[stageType]}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="flex-1 text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center font-bold text-primary mx-auto">
                    FIN
                  </div>
                  <div className="space-y-1 pt-1">
                    <p className="font-bold text-sm">최종합격</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: 안내사항 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">유의사항</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">기타 안내사항</p>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{job.notice}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3">
                <div className="flex gap-3 text-amber-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="text-sm space-y-2">
                    <p className="font-bold">블라인드 채용 가이드라인 준수</p>
                    <p className="text-amber-700/80 leading-relaxed font-medium">
                      본 채용은 블라인드 채용으로 진행됩니다. 입사지원서 및 자기소개서 작성 시 학력, 출신지, 가족관계 등 편견이 개입될 수 있는 정보를 기재할 경우 불이익을 받을 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-8 flex justify-center shadow-2xl">
          {(() => {
            const getButtonConfig = () => {
              switch (computedStatus) {
                case 'ONGOING':
                  return {
                    text: '지원하기',
                    disabled: false,
                    className: 'bg-primary hover:bg-secondary cursor-pointer',
                    tooltip: ''
                  };
                case 'UPCOMING':
                  return {
                    text: '모집예정',
                    disabled: true,
                    className: 'bg-slate-300 opacity-80 cursor-not-allowed',
                    tooltip: '공고 시작 후 지원 가능합니다.'
                  };
                case 'CLOSED':
                  return {
                    text: '접수마감',
                    disabled: true,
                    className: 'bg-slate-400 opacity-50 cursor-not-allowed',
                    tooltip: '접수 기간이 종료되었습니다.'
                  };
                default:
                  return { text: '지원불가', disabled: true, className: 'bg-slate-300', tooltip: '' };
              }
            };

            const btnConfig = getButtonConfig();

            return (
              <motion.button 
                whileHover={!btnConfig.disabled ? { scale: 1.02 } : {}}
                whileTap={!btnConfig.disabled ? { scale: 0.98 } : {}}
                disabled={btnConfig.disabled}
                title={btnConfig.tooltip}
                onClick={() => navigate(`/apply/${id}`)}
                className={cn(
                  "max-w-md w-full text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 group",
                  btnConfig.className
                )}
              >
                {btnConfig.text}
                {computedStatus === 'ONGOING' && <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              </motion.button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
