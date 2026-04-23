import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Hash, 
  CheckCircle2, 
  Clock, 
  BadgeCheck, 
  AlertCircle,
  Download,
  Share2
} from 'lucide-react';
import { MypageApplication } from '../../types';
import { cn } from '../../lib/utils';

interface ApplicationDetailProps {
  data: MypageApplication;
  onBack: () => void;
}

export default function ApplicationDetail({ data, onBack }: ApplicationDetailProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to list
      </button>

      <div className="bento-card overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border w-fit",
              data.status === '심사중' ? 'bg-blue-50 text-blue-600 border-blue-100' :
              data.status.includes('합격') ? 'bg-green-50 text-green-600 border-green-100' :
              data.status.includes('불합격') ? 'bg-red-50 text-red-600 border-red-100' :
              'bg-slate-50 text-slate-400 border-slate-100'
            )}>
              {data.status}
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight max-w-2xl">
              {data.postingTitle}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Hash className="w-3.5 h-3.5" />
              Receipt Number
            </div>
            <p className="text-lg font-black text-slate-700 font-mono italic">{data.receiptNumber}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              Applied Date
            </div>
            <p className="text-lg font-black text-slate-700 font-mono">{data.createdAt}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5" />
              Application ID
            </div>
            <p className="text-lg font-black text-slate-700 font-mono">{data.id}</p>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="p-6 bg-slate-50 rounded-3xl space-y-6">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              진행 타임라인
            </h3>
            
            <div className="space-y-0 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
              
              <TimelineItem 
                title="지원서 접수 완료" 
                date={data.createdAt} 
                active 
                icon={<CheckCircle2 className="w-4 h-4" />} 
              />
              <TimelineItem 
                title="서류 심사" 
                date="진행 중" 
                active={data.status === '심사중'} 
                icon={<Clock className="w-4 h-4" />} 
              />
              <TimelineItem 
                title="1차 전형 결과 발표" 
                date="예정" 
                icon={<BadgeCheck className="w-4 h-4" />} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-amber-900">심사 안내</h4>
          <p className="text-xs font-medium text-amber-700 leading-relaxed">
            현재 서류 심사가 진행 중입니다. 심사 결과는 지원 시 입력하신 연락처와 마이페이지를 통해 개별 안내드릴 예정입니다. 
            서류 정정 및 취소는 모집 기간 내에만 가능합니다.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({ title, date, active, icon }: { title: string, date: string, active?: boolean, icon: React.ReactNode }) {
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className={cn(
        "absolute left-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-all duration-500",
        active ? "bg-primary text-white scale-110" : "bg-slate-200 text-slate-400"
      )}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className={cn("text-sm font-black transition-colors", active ? "text-slate-800" : "text-slate-400")}>{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 font-mono italic">{date}</p>
      </div>
    </div>
  );
}
