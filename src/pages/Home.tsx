import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Clock, Users, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../types';
import { formatDate, cn } from '../lib/utils';

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: '2024년 하반기 연구직(수습) 정기 채용',
    category: '연구직',
    type: '정규직',
    deadLine: '2024-05-30',
    count: 2,
    status: 'ONGOING',
    description: '스마트 도시 및 경제 개발 분야 정책 지원 연구',
    fields: [],
    selectedStages: ['DOCUMENT', 'INTERVIEW_1', 'INTERVIEW_2'],
    qualifications: { common: '', additional: '' },
    requiredDocuments: [],
    schedule: { 
      postingPeriod: { start: '2024-05-01', end: '2024-05-30' },
      applicationPeriod: { start: '2024-05-10', end: '2024-05-30' },
      documentResults: '2024-06-05',
      interview1: '2024-06-15',
      finalResults: '2024-06-30'
    },
    salaryInfo: '당사 규정에 따름',
    contractPeriod: '',
    notice: '',
    attachments: []
  },
  {
    id: '2',
    title: '정규직 행정직원 채용 공고',
    category: '행정직',
    type: '정규직',
    deadLine: '2024-05-15',
    count: 1,
    status: 'ONGOING',
    description: '연구행정 지원 및 일반 행찰 수합',
    fields: [],
    selectedStages: ['DOCUMENT', 'INTERVIEW_1'],
    qualifications: { common: '', additional: '' },
    requiredDocuments: [],
    schedule: { 
      postingPeriod: { start: '2024-04-15', end: '2024-05-15' },
      applicationPeriod: { start: '2024-05-01', end: '2024-05-15' },
      documentResults: '2024-05-20',
      interview1: '2024-05-25',
      finalResults: '2024-05-30'
    },
    salaryInfo: '당사 규정에 따름',
    contractPeriod: '',
    notice: '',
    attachments: []
  },
  {
    id: '3',
    title: '기간제 연구보조원 모집',
    category: '연구직',
    type: '계약직',
    deadLine: '2024-06-10',
    count: 3,
    status: 'UPCOMING',
    description: '데이터 전처리 및 통계 분석 보조',
    fields: [],
    selectedStages: ['DOCUMENT', 'INTERVIEW_1'],
    qualifications: { common: '', additional: '' },
    requiredDocuments: [],
    schedule: { 
      postingPeriod: { start: '2024-06-01', end: '2024-06-10' },
      applicationPeriod: { start: '2024-06-05', end: '2024-06-10' },
      documentResults: '2024-06-15',
      interview1: '2024-06-20',
      finalResults: '2024-06-25'
    },
    salaryInfo: '당사 규정에 따름',
    contractPeriod: '',
    notice: '',
    attachments: []
  },
  {
    id: '4',
    title: '2024년 상반기 일반직 채용',
    category: '연구직',
    type: '정규직',
    deadLine: '2024-04-01',
    count: 1,
    status: 'CLOSED',
    description: '사회 복지 시스템 개선 연구 담당',
    fields: [],
    selectedStages: ['DOCUMENT', 'INTERVIEW_1'],
    qualifications: { common: '', additional: '' },
    requiredDocuments: [],
    schedule: { 
      postingPeriod: { start: '2024-03-01', end: '2024-04-01' },
      applicationPeriod: { start: '2024-03-15', end: '2024-04-01' },
      documentResults: '2024-04-05',
      interview1: '2024-04-10',
      finalResults: '2024-04-15'
    },
    salaryInfo: '당사 규정에 따름',
    contractPeriod: '',
    notice: '',
    attachments: []
  }
];

export default function Home() {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesFilter = filter === 'ALL' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      {/* Main Jobs Listing (Bento Large) */}
      <div className="col-span-12 lg:col-span-8 bento-card flex flex-col min-h-[600px]">
        <div className="bento-card-header">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg text-slate-800">진행 중인 채용공고</h2>
            <div className="flex gap-1">
              {['ALL', 'ONGOING', 'UPCOMING', 'CLOSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                    filter === s 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {s === 'ALL' ? '전체' : s === 'ONGOING' ? '진행' : s === 'UPCOMING' ? '예정' : '마감'}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="직무 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/20 w-40 sm:w-56"
            />
          </div>
        </div>

        <div className="p-5 space-y-4 flex-1">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  to={`/job/${job.id}`}
                  className={cn(
                    "group block p-4 rounded-xl border transition-all duration-300",
                    job.status === 'ONGOING' ? "bg-slate-50 border-transparent hover:bg-blue-50 hover:border-blue-200" :
                    job.status === 'UPCOMING' ? "bg-white border-slate-100 hover:bg-slate-50" :
                    "opacity-50 grayscale bg-slate-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase tracking-tighter",
                        job.category === '연구직' ? "bg-blue-800" : job.category === '행정직' ? "bg-slate-600" : "bg-slate-400"
                      )}>
                        {job.category}
                      </span>
                      {job.status === 'CLOSED' && <span className="text-[10px] font-bold text-red-500">종료</span>}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {job.status === 'CLOSED' ? '접수 마감' : `D-Day ${formatDate(job.deadLine)}`}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="mt-3 flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 인원: {job.count}명</span>
                    <span className="flex items-center gap-1"><Building className="w-3 h-3" /> 지역: 경기 수원</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 상태: {job.status === 'ONGOING' ? '접수중' : '대기'}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-sm">진행 중인 공고가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Bento Small) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Support Process Card */}
        <div className="bg-primary rounded-card p-6 text-white shadow-lg space-y-6">
          <h3 className="font-bold text-xs uppercase tracking-widest opacity-70">지원 프로세스</h3>
          <div className="space-y-4">
            {[
              { id: '01', title: '지원서 작성 및 증빙 제출', active: true },
              { id: '02', title: '서류 심사 (역량 검증)', active: false },
              { id: '03', title: '심층 면접 (직무/인성)', active: false },
              { id: '04', title: '최종 합격자 발표', active: false },
            ].map((step, idx) => (
              <div key={idx} className={cn("flex items-center gap-4 transition-opacity", !step.active && "opacity-50")}>
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                  step.active ? "bg-secondary" : "bg-white/10"
                )}>
                  {step.id}
                </span>
                <span className="text-xs font-semibold">{step.title}</span>
              </div>
            ))}
          </div>
          <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm">
            신규 지원하기
          </button>
        </div>

        {/* Result Checker Card */}
        <div className="bento-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">전형 결과 조회</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            성함과 접수번호를 입력하여 <br/>단계별 합격 여부를 확인할 수 있습니다.
          </p>
          <div className="space-y-2">
            <input type="text" placeholder="성함 입력" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary" />
            <input type="password" placeholder="접수번호 / 비밀번호" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary" />
            <button className="w-full bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold mt-1 shadow-md active:scale-95 transition-transform">조회하기</button>
          </div>
        </div>

        {/* Action Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/guide" className="bg-slate-100 p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all group">
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-primary">채용안내</span>
          </Link>
          <Link to="/inquiry" className="bg-slate-100 p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all group">
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-primary">1:1 문의</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
