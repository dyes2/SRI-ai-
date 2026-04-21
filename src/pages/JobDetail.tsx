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
import { formatDate } from '../lib/utils';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching based on id
  const job = {
    id,
    title: id === '1' ? '2024년 하반기 연구직(수습) 정기 채용' : '정규직 행정직원 채용 공고',
    category: '연구직',
    deadLine: '2024-05-30',
    count: 2,
    status: 'ONGOING',
    description: '스마트 도시 및 경제 개발 분야 정책 지원 연구'
  };

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
              정규직
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {job.title}
          </h1>
          
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4 text-primary" />
              <div className="text-sm">
                <span className="block text-[10px] uppercase font-bold text-slate-400">접수기간</span>
                <span className="font-semibold text-slate-700">~ {formatDate(job.deadLine)}</span>
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
                <span className="block text-[10px] uppercase font-bold text-slate-400">모집분야</span>
                <span className="font-semibold text-slate-700">{job.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-12">
          {/* Section 1: 주요 직무 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">수행직무 및 자격요건</h2>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-sm text-primary mb-3">주요 수행직무</h3>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                    <li>수원형 스마트도시 정책 연구 및 지원</li>
                    <li>지역 경제 개발 모델 수립 및 분석</li>
                    <li>정부 지원 사업 과제 기획 및 운영</li>
                    <li>관련 데이터 수집 및 정량/정성 분석</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary mb-3">지원 자격</h3>
                  <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                    <li>관련 분야 석사 학위 이상 소지자</li>
                    <li>국가공무원법 제33조에 의한 결격사유가 없는 자</li>
                    <li>해외여행에 결격사유가 없는 자</li>
                    <li>남자의 경우 병역필 또는 면제자</li>
                  </ul>
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
                {[
                  { step: '01', title: '서류전형', sub: '적격성 검토' },
                  { step: '02', title: '필기전형', sub: '인성/직무역량' },
                  { step: '03', title: '1차 면접', sub: '실무진 면접' },
                  { step: '04', title: '2차 면접', sub: '최종 면접' },
                  { step: '05', title: '최종합격', sub: '신체검사/임용' },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 text-center space-y-2">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-400 mx-auto z-10 relative bg-white">
                        {item.step}
                      </div>
                      {idx < 4 && <div className="absolute top-1/2 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-slate-100 -translate-y-1/2" />}
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: 안내사항 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-4">유의사항</h2>
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
          </section>
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-8 flex justify-center shadow-2xl">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/apply/${id}`)}
            className="max-w-md w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-3 group"
          >
            지원하기
            <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
