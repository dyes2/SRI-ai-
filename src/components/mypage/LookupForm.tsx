import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Lock, User, Phone, KeyRound } from 'lucide-react';

interface LookupFormProps {
  onIdentify: (name: string, phone: string) => void;
  onVerify: (password: string) => void;
  onForgotPassword: () => void;
  step: 'identify' | 'password';
  identifiedName?: string;
}

export default function LookupForm({ onIdentify, onVerify, onForgotPassword, step, identifiedName }: LookupFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIdentify(name, phone);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(password);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bento-card p-8 space-y-8"
    >
      <AnimatePresence mode="wait">
        {step === 'identify' ? (
          <motion.div 
            key="identify"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">지원 내역 조회</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-tight">Step 1: Identify Yourself</p>
            </div>

            <form onSubmit={handleIdentifySubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">성명</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">휴대폰 번호</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:bg-secondary transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  다음 단계
                  <KeyRound className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="password"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-500">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{identifiedName} 지원자님</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-tight">Step 2: Password Verification</p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">비밀번호</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="password" 
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none text-center tracking-[0.5em] placeholder:tracking-normal"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                >
                  비밀번호 확인
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 border-t border-dashed border-slate-100 flex flex-col items-center gap-4">
        <button 
          onClick={onForgotPassword}
          className="flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
        >
          <Lock className="w-3.5 h-3.5" />
          I forgot my password
        </button>
      </div>
    </motion.div>
  );
}
