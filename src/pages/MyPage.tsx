import { motion } from 'motion/react';
import { 
  History, 
  Settings, 
  LogOut, 
  Bell, 
  CheckCircle2, 
  BadgeCheck, 
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { ApplicationStatus } from '../types';

export default function MyPage() {
  const user = {
    name: '김수원',
    email: 'suwon@example.com'
  };

  const applications = [
    {
      id: 'A-1234',
      jobTitle: '2024년 하반기 연구직(수습) 정기 채용',
      status: '심사중' as ApplicationStatus,
      submittedAt: '2024-04-20 14:30',
      jobId: '1',
      deadline: '2024-05-30'
    },
    {
      id: 'A-1105',
      jobTitle: '2024년 상반기 행정직 채용',
      status: '미제출' as ApplicationStatus,
      submittedAt: '-',
      jobId: '2',
      deadline: '2026-04-23' // Assume current date is 2026-04-21
    },
    {
      id: 'A-1100',
      jobTitle: '2024년 상반기 일반직 채용',
      status: '1차전형 불합격' as ApplicationStatus,
      submittedAt: '2024-03-10 09:12',
      jobId: '4',
      deadline: '2024-03-11'
    }
  ];

  // Notification Logic
  const getNotifications = () => {
    const notifications: string[] = [];
    const now = new Date('2026-04-21'); // Mock fixed date for demo

    applications.forEach(app => {
      if (app.status === '미제출') {
        const deadlineDate = new Date(app.deadline);
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 2 && diffDays >= 0) {
          notifications.push(`[${app.jobTitle}] 최종제출을 하지 않은 입사지원서가 있습니다.`);
        }
      } else if (app.status === '접수완료') {
        notifications.push(`[${app.jobTitle}] 지원하신 입사서류가 접수되었습니다.`);
      } else if (app.status === '심사중') {
        notifications.push(`[${app.jobTitle}] 지원하신 채용공고가 심사중입니다.`);
      } else if (app.status.includes('합격') || app.status.includes('불합격')) {
        notifications.push(`[${app.jobTitle}] 지원하신 채용공고의 결과를 확인하여 주세요.`);
      }
    });

    return notifications;
  };

  const notifications = getNotifications();

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">마이페이지</h1>
          <p className="text-slate-500 mt-2">반갑습니다, {user.name} 지원자님.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button className="p-3 text-slate-400 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all shadow-sm relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
              )}
            </button>
          </div>
          <button className="p-3 text-slate-400 bg-white border border-slate-200 rounded-full hover:text-primary hover:border-primary transition-all shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-3 text-slate-400 bg-white border border-slate-200 rounded-full hover:text-red-500 hover:border-red-500 transition-all shadow-sm">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Bell className="w-5 h-5 text-primary" />
            새로운 알림
          </h2>
          <div className="space-y-2">
            {notifications.map((note, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 bg-primary/5 border border-primary/10 rounded-2xl"
              >
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{note}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                지원 현황 및 결과
              </h2>
            </div>

            <div className="grid gap-4">
              {applications.map((app, idx) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bento-card p-6 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                          {app.status === '미제출' ? '임시저장' : `접수번호: ${app.id}`}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-400 text-[10px] font-bold">
                          {app.status === '미제출' ? `마감일: ${app.deadline}` : app.submittedAt}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                        {app.jobTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-tight",
                        app.status === '심사중' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        app.status.includes('합격') ? 'bg-green-50 text-green-600 border-green-100' :
                        app.status.includes('불합격') ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-slate-50 text-slate-400 border-slate-100'
                      )}>
                        {app.status === '심사중' && <Clock className="w-4 h-4" />}
                        {app.status.includes('합격') && <BadgeCheck className="w-4 h-4" />}
                        {(!app.status.includes('합격') && app.status !== '심사중') && <CheckCircle2 className="w-4 h-4" />}
                        <span>{app.status}</span>
                      </div>
                      <Link 
                        to={`/job/${app.jobId}`}
                        className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-primary rounded-card p-8 text-white space-y-6 shadow-xl shadow-primary/20">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">도움이 필요하신가요?</h3>
              <p className="text-accent/60 text-sm mt-2 leading-relaxed">
                채용 절차나 시스템 이용 과정에서 궁금한 점이 있다면 FAQ를 확인하거나 1:1문의로 남겨주세요.
              </p>
            </div>
            <Link 
              to="/inquiry" 
              className="block w-full bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors text-center"
            >
              문의하기
            </Link>
          </div>

          <div className="bento-card p-6 space-y-4">
            <h3 className="font-bold text-slate-700">추천 채용 가이드</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <span className="text-sm font-medium text-slate-600">블라인드 채용 가이드라인</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                <span className="text-sm font-medium text-slate-600">연구실적 증빙방법 안내</span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
