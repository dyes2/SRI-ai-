import { Bell, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MypageApplication } from '../../types';

interface NotificationPanelProps {
  applications: MypageApplication[];
}

export default function NotificationPanel({ applications }: NotificationPanelProps) {
  const notifications = applications.map(app => ({
    message: `${app.postingTitle} - ${app.status}`,
    type: app.status.includes('합격') ? 'success' : 'info' as const,
    icon: app.status.includes('합격') ? (
      <BadgeCheck className="w-4 h-4 text-green-500" />
    ) : (
      <Info className="w-4 h-4 text-blue-500" />
    )
  }));

  return (
    <div className="space-y-6">
      <div className="bento-card p-6 space-y-4">
        <h3 className="font-black text-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          알림 영역
        </h3>
        
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((note, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer hover:border-primary/20 transition-all"
              >
                <div className="mt-0.5">{note.icon}</div>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed group-hover:text-primary transition-colors">
                  {note.message}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="py-8 text-center space-y-2">
              <Info className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">No New Alerts</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary rounded-card p-8 text-white space-y-6 shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <h3 className="text-xl font-black tracking-tight">도움이 필요하신가요?</h3>
          <p className="text-accent/60 text-xs font-medium leading-relaxed">
            채용 절차나 시스템 이용 과정에서 궁금한 점이 있다면 FAQ를 확인하거나 1:1문의로 남겨주세요.
          </p>
          <button className="flex items-center justify-between w-full bg-white text-primary px-5 py-3.5 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all group/btn active:scale-95">
            1:1 문의하기
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
  );
}
