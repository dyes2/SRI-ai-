import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  MessageCircleQuestion, 
  Megaphone, 
  Search,
  SearchX
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function FAQ() {
  const [activeTab, setActiveTab] = useState<'notice' | 'faq'>('notice');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      q: "입사지원서 내용을 수정하고 싶어요.",
      a: "채용 홈페이지 우측상단 마이페이지에서 본인의 입사지원 정상 접수 여부 및 수험번호를 확인 할 수 있으며 입사지원서의 수정은 접수 마감 전까지 가능합니다.\n단, 접수가 마감된 상태이거나 최종지원을 하신 경우에는 수정이 불가하오니 유의하시기 바랍니다."
    },
    {
      q: "입사지원을 취소하고 싶어요.",
      a: "채용 홈페이지 우측상단 마이페이지에서 삭제가 가능하며, 입사지원서의 삭제는 접수마감일 16시까지만 가능합니다. 입사지원서 삭제 후 복구는 불가하오니 유의하시기 바랍니다."
    }
  ];

  const notices: any[] = []; // Currently empty

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">공지사항</h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          채용과 관련된 공지사항과 자주 묻는 질문을 확인하실 수 있습니다.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('notice')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'notice' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Megaphone className="w-4 h-4" />
          공지사항
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'faq' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <MessageCircleQuestion className="w-4 h-4" />
          자주 묻는 질문 (FAQ)
        </button>
      </div>

      <div className="bento-card min-h-[400px]">
        {activeTab === 'notice' ? (
          <div className="p-0">
            {/* Notice Board Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800">공지사항 목록</h2>
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="공지 검색"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* Notice Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">번호</th>
                    <th className="px-6 py-4">제목</th>
                    <th className="px-6 py-4 w-24 text-center">작성자</th>
                    <th className="px-6 py-4 w-32 text-center">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {notices.length > 0 ? (
                    notices.map((notice, idx) => (
                      <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 text-xs font-medium text-slate-400 text-center">{notices.length - idx}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{notice.title}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-500 text-center">관리자</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400 text-center">{notice.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-32">
                        <div className="flex flex-col items-center justify-center space-y-4 text-slate-300">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <SearchX className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold">등록된 게시물이 없습니다.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-center">
               <div className="flex items-center gap-2">
                 <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">1</button>
               </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* FAQ Header */}
            <div className="mb-6">
              <h2 className="font-bold text-slate-800">자주 묻는 질문</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">서비스 이용과 관련하여 가장 많이 하시는 질문들을 모았습니다.</p>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
              {faqData.map((item, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "bento-card border transition-all duration-300 overflow-hidden",
                    openFaq === idx ? "border-primary/20 bg-primary/[0.02]" : "border-slate-100 hover:border-slate-200"
                  )}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                        openFaq === idx ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}>Q</span>
                      <span className={cn(
                        "font-bold text-sm md:text-base tracking-tight transition-colors",
                        openFaq === idx ? "text-primary" : "text-slate-700"
                      )}>{item.q}</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-slate-400 transition-transform duration-300",
                      openFaq === idx ? "rotate-180 text-primary" : ""
                    )} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-0 flex gap-4">
                           <div className="w-8 shrink-0 flex justify-center pt-1 italic font-bold text-primary/40 text-xl">A</div>
                           <div className="text-sm md:text-base text-slate-500 leading-relaxed font-medium whitespace-pre-wrap">
                             {item.a}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* FAQ Footer CTA */}
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-3">
               <p className="text-xs font-bold text-slate-500">원하시는 답변을 찾지 못하셨나요?</p>
               <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                 1:1 문의하기
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
