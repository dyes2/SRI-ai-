import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Phone, 
  Hash, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

// Mock data lookup inside ResetPassword or passed down
import { MOCK_APPLICANTS, MOCK_APPLICATIONS } from '../../pages/MyPage';

interface ResetPasswordProps {
  onResetComplete: (name: string, phone: string, receipt: string, newPass: string) => void;
  onCancel: () => void;
}

type Step = 'IDENTIFY' | 'VERIFY' | 'CHANGE' | 'SUCCESS';

export default function ResetPassword({ onResetComplete, onCancel }: ResetPasswordProps) {
  const [step, setStep] = useState<Step>('IDENTIFY');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    receiptNumber: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [timer, setTimer] = useState(300);
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval: any;
    if (step === 'VERIFY' && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0) {
      setErrorMessage('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    
    const applicant = MOCK_APPLICANTS.find(a => a.name === form.name && a.phone === form.phone);
    const hasApp = MOCK_APPLICATIONS.some(app => app.applicantId === applicant?.id && app.receiptNumber === form.receiptNumber);

    if (!applicant || !hasApp) {
      setErrorMessage('일치하는 지원 정보를 찾을 수 없습니다.');
      return;
    }

    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(mockCode);
    console.log(`[DEBUG] Verification Code: ${mockCode}`);
    setErrorMessage('');
    setStep('VERIFY');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.verificationCode === generatedCode) {
      setStep('CHANGE');
      setErrorMessage('');
    } else {
      const nextCount = errorCount + 1;
      setErrorCount(nextCount);
      if (nextCount >= 5) {
        setErrorMessage('인증 실패 횟수 초과(5회).');
        setTimeout(onCancel, 2000);
      } else {
        setErrorMessage(`인증번호가 틀렸습니다. (${nextCount}/5)`);
      }
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    onResetComplete(form.name, form.phone, form.receiptNumber, form.newPassword);
    setStep('SUCCESS');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-md mx-auto bento-card overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Security Protocol</span>
        <div className="w-8 h-8" />
      </div>

      <div className="p-8 space-y-8">
        <AnimatePresence mode="wait">
          {step === 'IDENTIFY' && (
            <motion.div 
              key="identify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800">본인 확인</h2>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Enter application details to start verification</p>
              </div>

              <form onSubmit={handleIdentify} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">성명</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="홍길동"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">휴대폰 번호</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="01012345678"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">접수 번호</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="text"
                      value={form.receiptNumber}
                      onChange={e => setForm({...form, receiptNumber: e.target.value})}
                      placeholder="A-1234 (지원 시 확인 가능)"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4">
                  인증번호 발송
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {step === 'VERIFY' && (
            <motion.div 
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800">인증번호 입력</h2>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Enter the 6-digit code sent to your phone</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-bold text-blue-700">남은 시간</span>
                </div>
                <span className={cn("font-mono text-lg font-black", timer < 60 ? "text-red-500" : "text-blue-500")}>
                  {formatTime(timer)}
                </span>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">인증번호</label>
                  <input 
                    required
                    type="text"
                    maxLength={6}
                    value={form.verificationCode}
                    onChange={e => setForm({...form, verificationCode: e.target.value})}
                    placeholder="000000"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-center tracking-[1em] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:tracking-normal placeholder:text-slate-200"
                  />
                  {errorMessage && (
                    <div className="flex items-center gap-2 text-red-500 mt-2 px-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[10px] font-bold">{errorMessage}</span>
                    </div>
                  )}
                </div>

                <button 
                  disabled={timer === 0}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:bg-secondary disabled:bg-slate-200 disabled:shadow-none transition-all"
                >
                  인증 확인
                </button>
              </form>
            </motion.div>
          )}

          {step === 'CHANGE' && (
            <motion.div 
              key="change"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-800">비밀번호 변경</h2>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Set your new secure access password</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">새 비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="password"
                      value={form.newPassword}
                      onChange={e => setForm({...form, newPassword: e.target.value})}
                      placeholder="8자 이상 입력"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">비밀번호 확인</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      required
                      type="password"
                      value={form.confirmPassword}
                      onChange={e => setForm({...form, confirmPassword: e.target.value})}
                      placeholder="비밀번호 재입력"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-red-500 mt-2 px-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">{errorMessage}</span>
                  </div>
                )}

                <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-green-600/20 hover:bg-green-700 transition-all mt-4">
                  비밀번호 저장 및 완료
                </button>
              </form>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">수항 완료</h2>
                <p className="text-sm font-medium text-slate-500">비밀번호가 성공적으로 변경되었습니다.</p>
              </div>
              <button 
                onClick={onCancel}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
              >
                조회 화면으로 돌아가기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
