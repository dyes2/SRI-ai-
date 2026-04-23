import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MypageApplicant, MypageApplication } from '../types';

// Components
import LookupForm from '../components/mypage/LookupForm';
import ApplicationList from '../components/mypage/ApplicationList';
import NotificationPanel from '../components/mypage/NotificationPanel';
import ResetPassword from '../components/mypage/ResetPassword';
import ApplicationDetail from '../components/mypage/ApplicationDetail';

// Mock Data
export const MOCK_APPLICANTS: MypageApplicant[] = [
  { id: 'app_1', name: '홍길동', phone: '01012345678', password: 'password123' }
];

export const MOCK_APPLICATIONS: MypageApplication[] = [
  {
    id: 'a_001',
    applicantId: 'app_1',
    postingTitle: '수원시정연구원 2024년 하반기 일반직 채용',
    status: '심사중',
    createdAt: '2026-04-21',
    receiptNumber: 'A-1234'
  },
  {
    id: 'a_002',
    applicantId: 'app_1',
    postingTitle: '2024년 제2차 정규직(연구직) 공개채용',
    status: '접수완료',
    createdAt: '2026-04-15',
    receiptNumber: 'R-7788'
  }
];

// Helper Functions (Abstraction)
const findApplicant = (name: string, phone: string) => {
  return MOCK_APPLICANTS.find(a => a.name === name && a.phone === phone);
};

const getApplicationsByApplicant = (applicantId: string) => {
  return MOCK_APPLICATIONS.filter(app => app.applicantId === applicantId);
};

export default function MyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [lookupStep, setLookupStep] = useState<'identify' | 'password'>('identify');
  const [currentUser, setCurrentUser] = useState<MypageApplicant | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<MypageApplication | null>(null);

  const matchedApplications = useMemo(() => {
    if (!currentUser) return [];
    return getApplicationsByApplicant(currentUser.id);
  }, [currentUser]);

  const handleIdentify = (name: string, phone: string) => {
    const user = findApplicant(name, phone);
    if (!user) {
      alert("일치하는 사용자가 없습니다.");
      return;
    }
    setCurrentUser(user);
    setLookupStep('password');
  };

  const handleVerifyPassword = (password: string) => {
    if (currentUser?.password === password) {
      setIsAuthenticated(true);
      
      const userApps = getApplicationsByApplicant(currentUser.id);
      if (userApps.length === 1) {
        setSelectedApplication(userApps[0]);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleResetPasswordAction = (name: string, phone: string, receipt: string, newPass: string) => {
    const applicant = findApplicant(name, phone);
    const userApps = applicant ? getApplicationsByApplicant(applicant.id) : [];
    const hasApplication = userApps.some(app => app.receiptNumber === receipt);

    if (!applicant || !hasApplication) {
      alert("정보가 일치하지 않습니다.");
      return;
    }

    // In a real app, this would be an API call
    applicant.password = newPass;
    console.log(`Password for ${name} updated successfully.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLookupStep('identify');
    setSelectedApplication(null);
  };

  if (isResetting) {
    return (
      <div className="py-12">
        <ResetPassword 
          onResetComplete={handleResetPasswordAction} 
          onCancel={() => setIsResetting(false)} 
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12">
        <LookupForm 
          step={lookupStep}
          identifiedName={currentUser?.name}
          onIdentify={handleIdentify}
          onVerify={handleVerifyPassword}
          onForgotPassword={() => setIsResetting(true)} 
        />
      </div>
    );
  }

  // Application Detail View
  if (selectedApplication) {
    return (
      <div className="py-8">
        <ApplicationDetail 
          data={selectedApplication} 
          onBack={() => setSelectedApplication(null)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg w-fit">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Applicant Dashboard</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">마이페이지</h1>
            <p className="text-slate-400 mt-2 font-medium">
              반갑습니다, <span className="text-slate-800 font-bold">{currentUser?.name}</span> 지원자님 
              <span className="ml-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                {currentUser?.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')}
              </span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-primary hover:border-primary transition-all shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-3 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-primary hover:border-primary transition-all shadow-sm">
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-3 text-slate-400 bg-white border border-slate-100 rounded-2xl hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          <ApplicationList 
            applications={matchedApplications} 
            onSelect={setSelectedApplication}
          />
        </div>

        <aside className="lg:col-span-4 translate-y-3">
          <NotificationPanel applications={matchedApplications} />
        </aside>
      </div>
    </div>
  );
}
