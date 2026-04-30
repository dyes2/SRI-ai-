import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Clock, Users, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDotDate, cn } from '../lib/utils';
import { useJob } from '../context/JobContext';
import { getComputedJobStatus } from '../lib/jobUtils';

export default function Home() {
  const { jobs } = useJob();
  const [filter, setFilter] = useState<'ALL' | 'ONGOING' | 'UPCOMING' | 'CLOSED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Use useMemo for performance and to handle filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const computedStatus = getComputedJobStatus(job);
      
      // 1. Search filter
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            job.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Status filter logic
      // User requested: Main page shows Ongoing + Upcoming by default.
      // If 'ALL' is selected, we show ONGOING and UPCOMING.
      // If a specific tab is selected, we show that.
      
      let matchesFilter = false;
      if (filter === 'ALL') {
        matchesFilter = computedStatus === 'ONGOING' || computedStatus === 'UPCOMING';
      } else {
        matchesFilter = computedStatus === filter;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [jobs, filter, searchTerm]);

  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      {/* Main Jobs Listing (Bento Large) */}
      <div className="col-span-12 lg:col-span-8 bento-card flex flex-col min-h-[600px]">
        <div className="bento-card-header">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-lg text-slate-800 shrink-0">채용공고 목록</h2>
              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['ALL', 'ONGOING', 'UPCOMING', 'CLOSED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded transition-all shrink-0",
                      filter === s 
                      ? "bg-primary text-white shadow-sm" 
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {s === 'ALL' ? '전체' : s === 'ONGOING' ? '모집중' : s === 'UPCOMING' ? '모집예정' : '마감'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="직무 또는 카테고리 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 w-full sm:w-56 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 flex-1">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => {
              const computedStatus = getComputedJobStatus(job);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    to={`/job/${job.id}`}
                    className={cn(
                      "group block p-5 rounded-2xl border transition-all duration-300",
                      computedStatus === 'ONGOING' ? "bg-white border-slate-100 hover:border-primary/30 hover:shadow-md" :
                      computedStatus === 'UPCOMING' ? "bg-slate-50/50 border-dashed border-slate-200 hover:border-slate-300" :
                      "bg-slate-50 border-transparent opacity-60 grayscale cursor-not-allowed"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-extrabold text-white px-2 py-0.5 rounded uppercase tracking-tighter",
                          job.category === '연구직' ? "bg-blue-600" : "bg-slate-600"
                        )}>
                          {job.category}
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
                          computedStatus === 'ONGOING' ? "bg-green-50 text-green-600 border-green-100" :
                          computedStatus === 'UPCOMING' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          "bg-slate-100 text-slate-400 border-slate-200"
                        )}>
                          {computedStatus === 'ONGOING' ? '모집중' : computedStatus === 'UPCOMING' ? '모집예정' : '마감'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {computedStatus === 'CLOSED' ? '접수 마감' : '접수 기간'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {formatDotDate(job.schedule?.postingPeriod.start)} ~ {formatDotDate(job.schedule?.postingPeriod.end)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug">
                      {job.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary/50" /> {job.count}명</span>
                        <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-primary/50" /> {job.type}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary/50" /> 경기 수원</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="font-bold text-slate-800">검색 결과가 없습니다</h3>
              <p className="text-slate-400 text-xs mt-1">다른 키워드로 검색하거나 필터를 변경해보세요.</p>
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
