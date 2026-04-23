import { motion } from 'motion/react';
import { Clock, CheckCircle2, BadgeCheck, ExternalLink, History } from 'lucide-react';
import { MypageApplication } from '../../types';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ApplicationListProps {
  applications: MypageApplication[];
  onSelect: (app: MypageApplication) => void;
}

export default function ApplicationList({ applications, onSelect }: ApplicationListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          지원 현황 리스트
        </h2>
        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tighter">
          Total {applications.length}
        </span>
      </div>

      <div className="grid gap-4">
        {applications.map((app, idx) => (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(app)}
            className="bento-card p-6 group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    접수번호: {app.receiptNumber}
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="text-slate-400 text-[10px] font-bold">
                    접수일: {app.createdAt}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-primary transition-colors leading-tight">
                  {app.postingTitle}
                </h3>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-tight",
                  app.status === '심사중' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  app.status.includes('합격') ? 'bg-green-50 text-green-600 border-green-100' :
                  app.status.includes('불합격') ? 'bg-red-50 text-red-600 border-red-100' :
                  'bg-slate-50 text-slate-400 border-slate-100'
                )}>
                  {app.status === '심사중' && <Clock className="w-3.5 h-3.5" />}
                  {app.status.includes('합격') && <BadgeCheck className="w-3.5 h-3.5" />}
                  {(!app.status.includes('합격') && app.status !== '심사중') && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{app.status}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
