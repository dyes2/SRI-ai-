import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  User, 
  UserCheck, 
  UserX, 
  MessageSquare, 
  Plus, 
  ChevronLeft, 
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Inquiry } from '../types';

type ViewMode = 'LIST' | 'WRITE' | 'DETAIL';

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: '1',
    category: '채용일정',
    title: '문의드립니다',
    author: '홍길동',
    publicName: true,
    content: '올해 하반기 채용 일정이 정확히 언제인가요?',
    createdAt: '2026-04-21',
    answer: '안녕하세요. 하반기 채용은 9월 중 공고될 예정입니다.',
    answeredAt: '2026-04-21'
  },
  {
    id: '2',
    category: '지원서 작성',
    title: '지원 관련 질문',
    author: '비공개',
    publicName: false,
    password: '1234',
    content: '연구 실적 증빙 서류에 학위 논문도 포함되나요?',
    createdAt: '2026-04-21'
  }
];

export default function InquiryPage() {
  const [view, setView] = useState<ViewMode>('LIST');
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [pwInput, setPwInput] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '채용일정' as Inquiry['category'],
    publicName: true,
    password: '',
    content: ''
  });

  const handleWrite = () => {
    const newInquiry: Inquiry = {
      id: String(Date.now()),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInquiries([newInquiry, ...inquiries]);
    setView('LIST');
    setFormData({
      title: '',
      author: '',
      category: '채용일정',
      publicName: true,
      password: '',
      content: ''
    });
  };

  const openDetail = (inquiry: Inquiry) => {
    if (inquiry.password) {
      setSelectedInquiry(inquiry);
      setView('DETAIL');
      setPwInput('');
      setError('');
    } else {
      setSelectedInquiry(inquiry);
      setView('DETAIL');
      setError('');
    }
  };

  const checkPassword = () => {
    if (selectedInquiry?.password === pwInput) {
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">1:1 문의하기</h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-sm font-medium">
          채용과 관련하여 궁금하신 사항을 남겨주시면 담당자가 신속하게 답변해 드립니다.
        </p>
      </section>

      <AnimatePresence mode="wait">
        {view === 'LIST' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="제목, 작성자 검색"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                />
              </div>
              <button 
                onClick={() => setView('WRITE')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
              >
                <Plus className="w-4 h-4" />
                문의 작성하기
              </button>
            </div>

            <div className="bento-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 w-20 text-center">번호</th>
                      <th className="px-6 py-4">제목</th>
                      <th className="px-6 py-4 w-24 text-center">작성자</th>
                      <th className="px-6 py-4 w-24 text-center">상태</th>
                      <th className="px-6 py-4 w-32 text-center">작성일</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {inquiries.map((item, idx) => (
                      <tr 
                        key={item.id} 
                        onClick={() => openDetail(item)}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-5 text-xs font-medium text-slate-400 text-center">{inquiries.length - idx}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{item.category}</span>
                            <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-slate-500 text-center">
                          {item.publicName ? item.author : <span className="text-slate-300 font-medium">비공개</span>}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {item.password ? (
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                              <Lock className="w-3 h-3" />
                              비밀번호
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                              <Unlock className="w-3 h-3" />
                              공개
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-xs font-medium text-slate-400 text-center">{item.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'WRITE' && (
          <motion.div 
            key="write"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bento-card p-8 space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('LIST')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-slate-800">문의 작성</h2>
              </div>

              <div className="space-y-6">
                {/* Warnings */}
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-orange-800">잠깐! 확인해주세요</p>
                    <p className="text-[11px] text-orange-700/80 leading-relaxed font-medium">
                      비밀번호를 설정하지 않으면 문의 내용이 누구나 조회가 가능하게 공개됩니다.<br/>
                      이름, 연락처 등 개인정보 포함 시 반드시 비공개 또는 비밀번호 설정을 권장합니다.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">이름 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      placeholder="작성자 이름 입력"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">문의 유형 <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="채용일정">채용일정</option>
                      <option value="시스템 오류">시스템 오류</option>
                      <option value="지원서 작성">지원서 작성</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">이름 공개 여부</label>
                    <div className="flex p-1 bg-slate-100 rounded-xl w-full">
                      <button 
                        onClick={() => setFormData({...formData, publicName: true})}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                          formData.publicName ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        공개 (기본)
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, publicName: false})}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                          !formData.publicName ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        비공개
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 ml-1">비밀번호 설정 (선택)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="미입력 시 전체 공개"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">제목 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="문의 제목을 입력해주세요"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">문의 내용 <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                    placeholder="문의 내용을 상세히 작성해주세요"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-700 resize-none"
                  />
                </div>

                <button 
                  onClick={handleWrite}
                  disabled={!formData.title || !formData.author || !formData.content}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none transition-all active:scale-[0.98]"
                >
                  <Send className="w-5 h-5" />
                  문의 등록하기
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'DETAIL' && selectedInquiry && (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {selectedInquiry.password && !pwInput && !selectedInquiry.answer ? (
               <div className="max-w-md mx-auto text-center space-y-8 py-20">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto border border-orange-100">
                    <Lock className="w-10 h-10 text-orange-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-800">비밀번호 확인</h2>
                    <p className="text-sm text-slate-500 font-medium">이 게시물은 비밀번호로 보호되어 있습니다.<br/>설정하신 비밀번호를 입력해주세요.</p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="password"
                      value={pwInput}
                      onChange={(e) => setPwInput(e.target.value)}
                      placeholder="비밀번호 입력"
                      className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-center outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-lg"
                    />
                    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setView('LIST')}
                        className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        목록으로
                      </button>
                      <button 
                        onClick={checkPassword}
                        className="px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
                      >
                        조회하기
                      </button>
                    </div>
                  </div>
               </div>
            ) : (selectedInquiry.password && pwInput !== selectedInquiry.password) ? (
              // This is essentially the same as above but with error
               <div className="max-w-md mx-auto text-center space-y-8 py-20">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto border border-orange-100">
                    <Lock className="w-10 h-10 text-orange-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-800">비밀번호 확인</h2>
                    <p className="text-sm text-slate-500 font-medium">이 게시물은 비밀번호로 보호되어 있습니다.<br/>설정하신 비밀번호를 입력해주세요.</p>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="password"
                      autoFocus
                      placeholder="비밀번호 입력"
                      onChange={(e) => setPwInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                      className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-center outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-lg"
                    />
                    {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setView('LIST')}
                        className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        목록으로
                      </button>
                      <button 
                        onClick={checkPassword}
                        className="px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
                      >
                        조회하기
                      </button>
                    </div>
                  </div>
               </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setView('LIST')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-slate-800">문의 내용 확인</h2>
                </div>

                <div className="bento-card">
                  <div className="p-8 space-y-8">
                    {/* Inquiry Info Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10">
                             {selectedInquiry.category}
                           </span>
                           {selectedInquiry.password && (
                            <span className="text-[10px] font-bold text-orange-500 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-100 flex items-center gap-1">
                              <Lock className="w-3 h-3" /> 비공개 건
                            </span>
                           )}
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedInquiry.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                           <div className="flex items-center gap-1.5">
                             <User className="w-3.5 h-3.5 text-slate-300" />
                             <span className="text-xs font-bold text-slate-600">
                               {selectedInquiry.publicName ? selectedInquiry.author : "비공개 작성자"}
                             </span>
                           </div>
                           <span className="text-slate-200">|</span>
                           <div className="flex items-center gap-1.5">
                             <Clock className="w-3.5 h-3.5 text-slate-300" />
                             <span className="text-xs font-medium text-slate-400">{selectedInquiry.createdAt}</span>
                           </div>
                        </div>
                      </div>
                      <div>
                        {selectedInquiry.answer ? (
                           <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-2xl border border-green-100">
                             <CheckCircle2 className="w-4 h-4" />
                             <span className="text-xs font-bold">답변 완료</span>
                           </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-2xl border border-slate-200">
                             <Clock className="w-4 h-4" />
                             <span className="text-xs font-bold">접수 대기</span>
                           </div>
                        )}
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-tight">질문 내용</span>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-base">
                        {selectedInquiry.content}
                      </div>
                    </div>

                    {/* Answer Section */}
                    {selectedInquiry.answer && (
                      <div className="space-y-4 pt-8 border-t border-dashed border-slate-200">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-green-600">
                             <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center font-bold text-xs italic">A</div>
                             <span className="font-bold text-sm tracking-tight">수원시정연구원 답변</span>
                           </div>
                           <span className="text-[10px] font-medium text-slate-400">{selectedInquiry.answeredAt}</span>
                        </div>
                        <div className="p-6 bg-green-50/50 rounded-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-base border border-green-100/50">
                          {selectedInquiry.answer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center pt-8">
                   <button 
                    onClick={() => setView('LIST')}
                    className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                   >
                     목록으로 돌아가기
                   </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
