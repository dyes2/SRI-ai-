import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Filter, 
  Download, 
  Search, 
  MoreHorizontal,
  Mail,
  Eye,
  Check,
  ChevronDown,
  MessageSquare,
  Reply,
  Unlock,
  Lock,
  User,
  Send,
  FileDown,
  Loader2,
  Settings2,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  Trash2,
  MinusCircle,
  PlusCircle,
  Sparkles,
  BookOpen,
  Cpu,
  FileSearch,
  Tag,
  Languages,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDate, cn, formatDotDate, formatDateISO } from '../lib/utils';
import { ApplicationStatus, Inquiry, EvaluationStage, ApplicantScore, Judge, StageType, Job } from '../types';
import { ApplicationPDF } from '../components/admin/ApplicationPDF';
import { SummaryPDF } from '../components/admin/SummaryPDF';

// Remove redundant INITIAL_ constants as they are now in JobContext
const STATUS_LIST: ApplicationStatus[] = [
  '미제출', 
  '접수완료', 
  '심사중', 
  '1차전형 합격', 
  '1차전형 불합격', 
  '2차전형 합격', 
  '2차전형 불합격', 
  '3차전형 합격', 
  '3차전형 불합격'
];

const TEMPLATES = [
  "채용 일정은 공고문을 참고해주세요.",
  "서류 접수는 마감일 18시까지 가능합니다.",
  "증빙 서류는 PDF 파일로 제출해주시기 바랍니다.",
  "공정한 심사를 위해 노력하겠습니다."
];

const MASTER_JUDGES: Judge[] = [
    { id: 'J1', name: '홍길동', affiliation: '수원시정연구원', position: '연구위원' },
    { id: 'J2', name: '김철수', affiliation: '○○대학교', position: '교수' },
    { id: 'J3', name: '이민수', affiliation: '수원시', position: '경제사회연구실장' },
    { id: 'J5', name: '박행정', affiliation: '수원시정연구원', position: '행정팀장' },
    { id: 'J6', name: '이인사', affiliation: '외부인사위원회', position: '위원' },
    { id: 'J7', name: '추가심사', affiliation: '경기정책포럼', position: '대표' },
];

import { useJob } from '../context/JobContext';
import { getComputedJobStatus } from '../lib/jobUtils';

export default function Admin() {
  const { 
    jobs: announcements,
    addJob, 
    updateJob, 
    deleteJob,
    inquiries, 
    setInquiries,
    applicants: applicantsList, 
    setApplicants: setApplicantsList, 
    applicantScores, 
    setApplicantScores,
    evaluationStages,
    setEvaluationStages
  } = useJob();
  
  const [activeTab, setActiveTab] = useState<'announcements' | 'applicants' | 'inquiries' | 'evaluation' | 'settings'>('announcements');
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormStep, setJobFormStep] = useState(1);
  const [activeEvalJob, setActiveEvalJob] = useState<string>(announcements[0]?.id || '');
  const [activeEvalStageType, setActiveEvalStageType] = useState<StageType>('DOCUMENT');
  
  // Update activeEvalJob if announcements change and it was empty
  useEffect(() => {
    if (!activeEvalJob && announcements.length > 0) {
      setActiveEvalJob(announcements[0].id);
    }
  }, [announcements, activeEvalJob]);

  // PDF Export States
  const [isExporting, setIsExporting] = useState(false);
  const [exportTarget, setExportTarget] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  // Integrated PDF States
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryConfig, setSummaryConfig] = useState({
    isBlind: true,
    type: 'LIST' as 'LIST' | 'DETAIL'
  });
  const [isExportingSummary, setIsExportingSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Evaluation Specific States
  const [evaluatingApplicantId, setEvaluatingApplicantId] = useState<string | null>(null);

  // Evaluation Form Tracking
  const [evalForm, setEvalForm] = useState<{
    judgeId: string;
    isEligible: boolean;
    scores: Record<string, number>;
    bonusRate: 0 | 5 | 10;
    comment: string;
  }>({
    judgeId: MASTER_JUDGES[0].id,
    isEligible: true,
    scores: {},
    bonusRate: 0,
    comment: ''
  });

  // Job Announcement Management States
  const [jobForm, setJobForm] = useState<Partial<Job>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSignPopupOpen, setIsSignPopupOpen] = useState(false);
  const [isSignAgreed, setIsSignAgreed] = useState(false);

  // Applicant Document Panel States
  const [viewingApplicantPanel, setViewingApplicantPanel] = useState<{
    applicant: any;
    mode: 'DOCS' | 'AI';
    tab: 'intro' | 'plan' | 'files' | 'analysis';
  } | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});
  const [memos, setMemos] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('ATS_ADMIN_MEMOS');
    return saved ? JSON.parse(saved) : {};
  });

  const analyzeApplicant = (applicantId: string, applicant: any) => {
    if (analysisResults[applicantId]) return;

    // Simulate AI computing
    const res = {
      summary: [
        `${applicant.job || '지원'} 분야 실무 경험 및 이론적 배경 보유`,
        `조직 내 커뮤니케이션 및 협업 강점 강조`,
        `수원시 정책 발전에 대한 구체적인 기여 의지 확인`
      ],
      keywords: ['정책연구', '빅데이터', '협업', '실무중심', '혁신', '분석능력', '창의성'],
      matchKeywords: applicant.job?.includes('연구직') ? ['정책연구', '데이터분석', '보고서작성'] : ['행정관리', '예산운용', '회계'],
      metrics: {
        repetitionRate: Math.floor(Math.random() * 15) + 5,
        similarity: Math.floor(Math.random() * 20) + 10,
        formalRate: Math.floor(Math.random() * 30) + 60
      },
      aiSuspicion: Math.floor(Math.random() * 100),
      length: {
        intro: (applicant.data?.intro?.motive?.length || 0) + (applicant.data?.intro?.capability?.length || 0) + (applicant.data?.intro?.experience?.length || 0) + (applicant.data?.intro?.suitability?.length || 0),
        plan: (applicant.data?.plan?.direction?.length || 0) + (applicant.data?.plan?.utilization?.length || 0) + (applicant.data?.plan?.contribution?.length || 0)
      },
      readability: {
        conciseness: 85,
        specificity: 92,
        experienceBased: 95
      }
    };
    
    setAnalysisResults(prev => ({ ...prev, [applicantId]: res }));
  };

  useEffect(() => {
    localStorage.setItem('ATS_ADMIN_MEMOS', JSON.stringify(memos));
  }, [memos]);

  // Judge Pool Implementation
  const [masterJudges, setMasterJudges] = useState<Judge[]>(MASTER_JUDGES);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isJudgePoolOpen, setIsJudgePoolOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const [judgeFormData, setJudgeFormData] = useState({ name: '', affiliation: '', position: '' });
  const [judgeFormError, setJudgeFormError] = useState('');

  const [inquirySearch, setInquirySearch] = useState('');
  const [applicantSearch, setApplicantSearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'ALL' | 'PENDING' | 'ANSWERED'>('ALL');
  const [inquiryVisibilityFilter, setInquiryVisibilityFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [filterJob, setFilterJob] = useState<'ALL' | string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  const jobsList = announcements.map(j => j.title);

  // Admin Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock auth
    if (adminId === 'admin' && adminPw === 'admin1234') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">관리자 로그인</h2>
            <p className="text-slate-400 text-sm font-medium">권한이 있는 계정만 접속 가능합니다.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">아이디</label>
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="ID"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">비밀번호</label>
              <input 
                type="password" 
                value={adminPw}
                onChange={(e) => setAdminPw(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-bold ml-1 animate-bounce">아이디 또는 비밀번호가 일치하지 않습니다.</p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-secondary transition-all active:scale-[0.98]"
            >
              로그인하기
            </button>
          </form>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-300 font-bold">SUWON RESEARCH INSTITUTE ADMIN SYSTEM</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const getDuplicateCount = (applicant: any) => {
    if (!applicant.data?.personal) return 0;
    const { name, birthday } = applicant.data.personal;
    return applicantsList.filter(a => 
      a.data?.personal?.name === name && 
      a.data?.personal?.birthday === birthday
    ).length;
  };

  const filteredApplicants = activeTab === 'evaluation'
    ? applicantsList.filter(a => a.jobId === activeEvalJob)
    : applicantsList.filter(a => {
        const matchesJob = filterJob === 'ALL' || a.job === filterJob;
        const searchLow = applicantSearch.toLowerCase();
        const matchesSearch = a.name.toLowerCase().includes(searchLow) || 
                             a.email.toLowerCase().includes(searchLow) || 
                             a.id.toLowerCase().includes(searchLow);
        return matchesJob && matchesSearch;
      });

  const filteredInquiries = inquiries.filter(i => {
    const searchLow = inquirySearch.toLowerCase();
    const matchesSearch = i.title.toLowerCase().includes(searchLow) || 
                         i.author.toLowerCase().includes(searchLow) || 
                         i.content.toLowerCase().includes(searchLow);
    const matchesStatus = inquiryStatusFilter === 'ALL' || (inquiryStatusFilter === 'PENDING' ? !i.answer : !!i.answer);
    const matchesVisibility = inquiryVisibilityFilter === 'ALL' || (inquiryVisibilityFilter === 'PUBLIC' ? !i.password : !!i.password);
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplicants.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setApplicantsList(prev => prev.map(a => 
      selectedIds.includes(a.id) ? { ...a, status: newStatus } : a
    ));
    setSelectedIds([]);
    setIsStatusMenuOpen(false);
  };

  const submitReply = () => {
    if (!viewingInquiry) return;
    setInquiries(prev => prev.map(i => 
      i.id === viewingInquiry.id 
      ? { ...i, answer: replyText, answeredAt: new Date().toISOString().split('T')[0] } 
      : i
    ));
    setViewingInquiry(null);
    setReplyText('');
  };

  const handleView = (inquiry: Inquiry) => {
    setViewingInquiry(inquiry);
    setReplyText(inquiry.answer || '');
  };

  const exportToPDF = async (applicant: any) => {
    setExportTarget(applicant);
    setIsExporting(true);
    
    // Wait for DOM render
    setTimeout(async () => {
      if (!pdfRef.current) return;
      try {
        const canvas = await html2canvas(pdfRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`지원서_${applicant.name}_${applicant.id}.pdf`);
      } catch (error) {
        console.error('PDF Export Error:', error);
      } finally {
        setIsExporting(false);
        setExportTarget(null);
      }
    }, 100);
  };

  const exportSummaryPDF = async () => {
    setIsExportingSummary(true);
    // Wait for DOM
    setTimeout(async () => {
      if (!summaryRef.current) return;
      try {
        const canvas = await html2canvas(summaryRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const fileName = `통합지원현황_${filterJob}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Summary PDF Export Error:', error);
      } finally {
        setIsExportingSummary(false);
        setIsSummaryModalOpen(false);
      }
    }, 100);
  };

  const handleSaveJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeFormData.name.trim() || judgeFormData.affiliation.length < 2 || !judgeFormData.position.trim()) {
      setJudgeFormError('모든 필드를 올바르게 입력해주세요 (이름 필수, 소속 2자 이상, 직급 필수)');
      return;
    }

    if (editingJudge) {
      setMasterJudges(prev => prev.map(j => j.id === editingJudge.id ? { ...j, ...judgeFormData } : j));
      // Also update in stages if needed (optional but good for consistency)
      setEvaluationStages(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(job => {
              next[job] = next[job].map(stage => ({
                  ...stage,
                  judges: stage.judges.map(j => j.id === editingJudge.id ? { ...j, ...judgeFormData } : j)
              }));
          });
          return next;
      });
    } else {
      const newJudge = {
        id: `J${Date.now()}`,
        ...judgeFormData,
        role: '심사위원'
      };
      setMasterJudges(prev => [...prev, newJudge]);
    }

    setIsJudgeModalOpen(false);
    setEditingJudge(null);
    setJudgeFormData({ name: '', affiliation: '', position: '' });
    setJudgeFormError('');
  };

  const deleteJudge = (id: string) => {
    // Audit check: Check if evaluate records exist for this judge (Mock)
    const isUnderEvaluation = applicantScores.some(s => s.judgeId === id);
    if (isUnderEvaluation) {
      alert('평가 기록이 있는 심사위원은 삭제할 수 없습니다.');
      return;
    }
    setMasterJudges(prev => prev.filter(j => j.id !== id));
    // Remove from stages too
    setEvaluationStages(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(job => {
            next[job] = next[job].map(stage => ({
                ...stage,
                judges: stage.judges.filter(j => j.id !== id)
            }));
        });
        return next;
    });
  };

  const toggleJudgeSelection = (judge: Judge) => {
    setEvaluationStages(prev => {
        const stageList = prev[activeEvalJob] || [];
        const updatedList = stageList.map(s => {
            if (s.type === activeEvalStageType) {
                const isSelected = s.judges.some(j => j.id === judge.id);
                const nextJudges = isSelected 
                    ? s.judges.filter(j => j.id !== judge.id)
                    : [...s.judges, { ...judge, role: '심사위원' }];
                return { ...s, judges: nextJudges };
            }
            return s;
        });
        return { ...prev, [activeEvalJob]: updatedList };
    });
  };

  const saveJob = () => {
    if (!jobForm.title) {
        alert('공고명을 입력해주세요.');
        setJobFormStep(1);
        return;
    }
    
    // Determine status automatically based on dates using helper
    const calculatedStatus = getComputedJobStatus(jobForm as Job);

    const finalJob = {
        ...jobForm,
        id: jobForm.id || `JOB-${Date.now()}`,
        status: calculatedStatus,
        deadLine: jobForm.schedule?.postingPeriod.end || jobForm.deadLine
    } as Job;

    console.log('Final Prepared Job for Context:', finalJob);

    const exists = announcements.find(j => j.id === finalJob.id);
    if (exists) {
      updateJob(finalJob);
    } else {
      addJob(finalJob);
    }

    setIsJobFormOpen(false);
    setJobFormStep(1);
    setEditingJob(null);
    alert('공고가 성공적으로 저장되었습니다.');
  };

  const startEvaluation = (applicantId: string) => {
    const stage = evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType);
    if (!stage) return;

    // Default to the first judge in the stage
    const defaultJudgeId = stage.judges[0]?.id || '';
    
    // Check if there's existing data
    const existing = applicantScores.find(s => s.applicantId === applicantId && s.judgeId === defaultJudgeId && s.stageType === activeEvalStageType);
    
    if (existing) {
        setEvalForm({
            judgeId: existing.judgeId,
            isEligible: existing.isEligible,
            scores: { ...existing.scores },
            bonusRate: existing.bonusRate,
            comment: existing.comment || ''
        });
    } else {
        setEvalForm({
            judgeId: defaultJudgeId,
            isEligible: true,
            scores: stage.criteria.reduce((acc, curr) => ({ ...acc, [curr.id]: 0 }), {}),
            bonusRate: 0,
            comment: ''
        });
    }
    setEvaluatingApplicantId(applicantId);
  };

  const submitEvaluation = () => {
    // Show sign popup
    setIsSignPopupOpen(true);
    setIsSignAgreed(false);
  };

  const finalSubmit = () => {
    if (!evaluatingApplicantId || !isSignAgreed) return;

    const judge = masterJudges.find(j => j.id === evalForm.judgeId);
    
    const newScore: ApplicantScore = {
        applicantId: evaluatingApplicantId,
        stageType: activeEvalStageType,
        judgeId: evalForm.judgeId,
        scores: { ...evalForm.scores },
        isEligible: evalForm.isEligible,
        bonusRate: evalForm.bonusRate,
        comment: evalForm.comment,
        status: 'SIGNED',
        signedAt: new Date().toLocaleString(),
        signedBy: judge?.name || 'Unknown',
        ipAddress: '121.254.***.***' // Mock IP
    };

    setApplicantScores(prev => [
        ...prev.filter(s => !(s.applicantId === evaluatingApplicantId && s.judgeId === evalForm.judgeId && s.stageType === activeEvalStageType)),
        newScore
    ]);

    setIsSignPopupOpen(false);
    setEvaluatingApplicantId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">관리자 시스템 (ATS)</h1>
          <p className="text-slate-500 text-sm mt-1">실시간 지원 현황 및 전형 관리를 수행합니다.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4 text-slate-400" />
            통계 Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all">
            <Mail className="w-4 h-4" />
            전체 공지 발송
          </button>
        </div>
      </header>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: '전체 지원자', 
            val: applicantsList.length.toLocaleString(), 
            delta: activeTab === 'applicants' ? `최근 ${applicantsList.filter(a => a.isNew).length}건` : '+12', 
            icon: Users, 
            color: 'blue' 
          },
          { 
            label: '중복지원 의심', 
            val: applicantsList.filter(a => getDuplicateCount(a) > 1).length.toLocaleString(), 
            delta: '상세확인', 
            icon: AlertCircle, 
            color: 'orange' 
          },
          { 
            label: '진행중 공고', 
            val: announcements.length.toLocaleString(), 
            delta: 'Live', 
            icon: FileText, 
            color: 'purple' 
          },
          { 
            label: '미열람 서류', 
            val: applicantsList.filter(a => a.isNew).length.toLocaleString(), 
            delta: '확인필요', 
            icon: BookOpen, 
            color: 'green' 
          },
        ].map((stat, idx) => (
          <div key={idx} className="bento-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xl ${stat.delta.startsWith('+') || stat.delta === 'New' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                {stat.delta}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('applicants'); setSelectedIds([]); setViewingInquiry(null); }}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'applicants' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Users className="w-4 h-4" />
          지원자 관리
        </button>
        <button 
          onClick={() => { setActiveTab('inquiries'); setSelectedIds([]); setViewingInquiry(null); }}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'inquiries' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          1:1 문의 관리
        </button>
        <button 
          onClick={() => { setActiveTab('evaluation'); setSelectedIds([]); setViewingInquiry(null); }}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'evaluation' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <ClipboardCheck className="w-4 h-4" />
          심사 시스템
        </button>
        <button 
          onClick={() => { setActiveTab('announcements'); setSelectedIds([]); setViewingInquiry(null); }}
          className={cn(
            "flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'announcements' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Settings2 className="w-4 h-4" />
          공고문 등록/관리
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Announcement Management Section */}
        {activeTab === 'announcements' && (
          <div className="col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bento-card p-0 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50">
                   <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        공고문 등록 및 관리
                      </h2>
                      <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tighter">Announcement Generation System v2.0</p>
                   </div>
                    <button 
                     onClick={() => {
                       setEditingJob(null);
                       setJobForm({
                         id: `JOB-${new Date().getFullYear()}-${String(announcements.length + 1).padStart(3, '0')}`,
                         title: '',
                         category: '연구직',
                         type: '정규직',
                         deadLine: formatDateISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                         count: 0,
                         status: 'UPCOMING',
                         description: '',
                         fields: [{ id: 'f_init', name: '', major: '', slots: 0, content: '' }],
                         selectedStages: ['DOCUMENT', 'INTERVIEW_1'],
                         qualifications: { common: '지방공무원법 제31조의 결격사유가 없는 자', additional: '' },
                         requiredDocuments: ['응시원서', '자기소개서'],
                         schedule: {
                           postingPeriod: { start: formatDateISO(new Date()), end: formatDateISO(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) },
                           applicationPeriod: { start: formatDateISO(new Date()), end: formatDateISO(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) },
                           documentResults: '',
                           interview1: '',
                           finalResults: ''
                         },
                         salaryInfo: '당사 내부 규정에 따름',
                         contractPeriod: '',
                         notice: '공공기관 블라인드 채용 가이드를 준수합니다.',
                         attachments: []
                       });
                       setJobFormStep(1); // Reset to first step
                       setIsJobFormOpen(true);
                     }}
                     className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 cursor-pointer z-10"
                    >
                       <PlusCircle className="w-4 h-4" />
                       신규 공고 등록
                    </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / 유형</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">공고명</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">모집분야</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">전형단계</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">상태</th>
                        <th className="px-8 py-5 w-24"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {announcements.map(job => (
                        <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="space-y-1">
                               <p className="text-xs font-black text-slate-400 font-mono tracking-tighter">{job.id}</p>
                               <span className={cn(
                                 "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border",
                                 job.category === '연구직' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                 job.category === '행정직' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                 'bg-emerald-50 text-emerald-600 border-emerald-100'
                               )}>
                                 {job.category}
                               </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="max-w-xs space-y-1">
                               <p className="text-sm font-black text-slate-800 line-clamp-1">{job.title}</p>
                               <p className="text-[10px] font-bold text-slate-400 truncate">{job.description}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-wrap gap-1.5">
                                {job.fields.map(f => (
                                  <span key={f.id} className="px-2 py-0.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200/50">
                                    {f.name} ({f.slots})
                                  </span>
                                ))}
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-1">
                                {job.selectedStages.map((stage, idx) => (
                                  <React.Fragment key={stage}>
                                     <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                       {stage === 'DOCUMENT' ? '서류' : stage === 'INTERVIEW_1' ? '1차' : stage === 'INTERVIEW_PT' ? 'PT' : '2차'}
                                     </span>
                                     {idx < job.selectedStages.length - 1 && <ChevronDown className="w-2.5 h-2.5 -rotate-90 text-slate-300" />}
                                  </React.Fragment>
                                ))}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            {(() => {
                              const computedStatus = getComputedJobStatus(job);
                              return (
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-black tracking-tight border",
                                  computedStatus === 'ONGOING' ? 'bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-200/50' : 
                                  computedStatus === 'UPCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-slate-50 text-slate-400 border-slate-100'
                                )}>
                                  {computedStatus === 'ONGOING' ? '게시중' : computedStatus === 'UPCOMING' ? '예정' : '종료'}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => { setEditingJob(job); setJobForm(job); setIsJobFormOpen(true); }}
                                  className="p-2 text-slate-400 hover:text-primary transition-colors bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (confirm('해당 공고를 삭제하시겠습니까? 데이터는 복구할 수 없습니다.')) {
                                      deleteJob(job.id);
                                    }
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm hover:border-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}
        {/* Evaluation System Section */}
        {activeTab === 'evaluation' ? (
          <div className="col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Stage Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">심사 시스템</h2>
                  <select 
                    value={activeEvalJob}
                    onChange={(e) => {
                      setActiveEvalJob(e.target.value);
                      setActiveEvalStageType('DOCUMENT');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white border-0 rounded-xl text-xs font-bold font-mono outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                  >
                    {announcements.map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                   {evaluationStages[activeEvalJob]?.map(stage => (
                     <button 
                       key={stage.type}
                       onClick={() => setActiveEvalStageType(stage.type)}
                       className={cn(
                         "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                         activeEvalStageType === stage.type ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                       )}
                     >
                       {stage.title}
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="bg-white p-2 rounded-2xl border border-slate-200/50 shadow-xl flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">과락 기준</p>
                        <p className="text-lg font-black text-red-600">
                          {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.minPassScore || 0}점
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">모집인원</p>
                        <p className="text-lg font-black text-slate-800">
                          {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.openings}명
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pr-2 border-l border-slate-100 ml-2 pl-4">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-slate-600">배수</span>
                        <select 
                          value={evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.multiplier}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setEvaluationStages(prev => ({
                              ...prev,
                              [activeEvalJob]: (prev[activeEvalJob] || []).map(s => s.type === activeEvalStageType ? { ...s, multiplier: val } : s)
                            }));
                          }}
                          className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold p-1 outline-none"
                        >
                          {[1, 2, 3, 5, 10].map(m => <option key={m} value={m}>{m}배수</option>)}
                        </select>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left: Judge and Configuration */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bento-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      심사위원 배정
                    </h3>
                    <div className="flex gap-2">
                         <button 
                          onClick={() => setIsJudgePoolOpen(true)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-100 transition-all"
                         >
                            위원 풀 관리
                         </button>
                         <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-lg text-slate-500 border border-slate-200/50">
                          {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.judges?.length || 0}명
                        </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.judges?.map(judge => (
                      <div key={judge.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-200 shadow-sm">
                            {judge.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{judge.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{judge.affiliation} · {judge.position}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setEvaluationStages(prev => ({
                              ...prev,
                              [activeEvalJob]: (prev[activeEvalJob] || []).map(s => s.type === activeEvalStageType ? { ...s, judges: s.judges.filter(j => j.id !== judge.id) } : s)
                            }));
                          }}
                          className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsJudgePoolOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      심사위원 배정하기
                    </button>
                  </div>
                </div>

                <div className="bento-card p-6 bg-slate-900 text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h3 className="font-bold tracking-tight">AI 심사 어시스턴트</h3>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    구글 Gemini가 지원자의 자기소개서를 분석하여 직무 적합성 키워드를 추출하고, 심사위원 간의 점수 편차(이상치)를 감지하여 공정한 평가를 돕습니다.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['#이상치감지', '#키워드요약', '#적합성분석'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-accent border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Applicants and Scores */}
              <div className="col-span-12 lg:col-span-8 bento-card p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">합격자 자동 선정 현황</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                       <span className="w-2 h-2 rounded-full bg-green-500" />
                       <span className="text-slate-600">합격 가능권</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                       <span className="w-2 h-2 rounded-full bg-slate-300" />
                       <span className="text-slate-400">탈락권</span>
                    </div>
                  </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-16">순위</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">지원자</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">자격판단</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">평균점수</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">합격여부</th>
                      <th className="px-6 py-4 "></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants
                      .map(a => {
                        const allScores = applicantScores.filter(s => s.applicantId === a.id && s.stageType === activeEvalStageType);
                        const signedScores = allScores.filter(s => s.status === 'SIGNED');
                        const isEligible = allScores.every(s => s.isEligible) && allScores.length > 0;
                        const avg = signedScores.length > 0 
                          ? signedScores.reduce((sum: number, s: ApplicantScore) => {
                              const base = Object.values(s.scores).reduce((a: number, b: number) => a + b, 0);
                              return sum + (base * (1 + s.bonusRate / 100));
                            }, 0) / signedScores.length
                          : 0;
                        return { ...a, avg, isEligible, allScores };
                      })
                      .sort((a, b) => b.avg - a.avg)
                      .map((a, idx) => {
                        const currentStage = evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType);
                        const passCutoff = (currentStage?.openings || 0) * (currentStage?.multiplier || 1);
                        const minPassScore = currentStage?.minPassScore || 0;
                        const isAboveCutoff = a.avg >= minPassScore;
                        const isPassing = idx < passCutoff && a.avg > 0 && a.isEligible && isAboveCutoff;
                        
                        return (
                          <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5 text-center">
                              <span className={cn(
                                "text-sm font-black italic",
                                isPassing ? "text-primary" : "text-slate-300"
                              )}>{idx + 1}</span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">
                                  {a.name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-700">{a.name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono italic">{a.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex -space-x-2">
                                  {currentStage?.judges.map(judge => {
                                      const score = a.allScores.find(s => s.judgeId === judge.id);
                                      return (
                                          <div 
                                            key={judge.id} 
                                            title={`${judge.name}: ${score ? score.status : '미작성'}`}
                                            className={cn(
                                              "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black tracking-tighter",
                                              score?.status === 'SIGNED' ? "bg-green-500 text-white" : 
                                              score?.status === 'SUBMITTED' ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-400"
                                            )}
                                          >
                                             {judge.name[0]}
                                          </div>
                                      );
                                  })}
                               </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                               {a.allScores.length > 0 ? (
                                 <span className={cn(
                                   "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight",
                                   a.isEligible ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600 font-bold underline decoration-dotted"
                                 )}>
                                   {a.isEligible ? '적격' : '부적격'}
                                 </span>
                               ) : (
                                 <span className="text-[10px] font-bold text-slate-300">미심사</span>
                               )}
                            </td>
                            <td className="px-6 py-5 text-center">
                               <p className="text-base font-black text-slate-800">{a.avg.toFixed(1)}</p>
                            </td>
                            <td className="px-6 py-5 text-center">
                               <div className={cn(
                                 "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                                 isPassing 
                                   ? "bg-green-50 text-green-600 border-green-100 shadow-sm" 
                                   : "bg-slate-50 text-slate-400 border-slate-100"
                               )}>
                                 {isPassing ? <Check className="w-3 h-3" /> : <MinusCircle className="w-3 h-3" />}
                                 {isPassing ? '합격권' : '미달/탈락'}
                               </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <button 
                                onClick={() => startEvaluation(a.id)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-primary hover:border-primary transition-all shadow-sm"
                               >
                                 심사하기
                               </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'applicants' ? (
          <div className="col-span-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-slate-800">지원자 목록</h2>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Syncing</span>
                  </div>
                </div>
                {selectedIds.length > 0 && (
                  <p className="text-xs text-primary font-bold">{selectedIds.length}명 선택됨</p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Job Filter */}
                <select 
                  value={filterJob}
                  onChange={(e) => setFilterJob(e.target.value)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none pr-10 relative cursor-pointer"
                >
                  <option value="ALL">전체 공고 보기</option>
                  {jobsList.map(job => <option key={job} value={job}>{job}</option>)}
                </select>

                {/* Integrated PDF Button (Only visible if a specific job is selected) */}
                {filterJob !== 'ALL' && (
                  <button 
                    onClick={() => setIsSummaryModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    통합 인적사항 PDF
                  </button>
                )}

                {/* Bulk Status Update */}
                <div className="relative">
                  <button 
                    onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                    disabled={selectedIds.length === 0}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm",
                      selectedIds.length > 0 
                      ? "bg-white border-primary text-primary hover:bg-primary/5" 
                      : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                    )}
                  >
                    전용상태 변경
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {isStatusMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                      >
                        {STATUS_LIST.map(status => (
                          <button 
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="w-full px-4 py-2.5 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors border-b last:border-0 border-slate-50"
                          >
                            {status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      value={applicantSearch}
                      onChange={(e) => setApplicantSearch(e.target.value)}
                      placeholder="지원자명, 이메일 검색"
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all w-48"
                    />
                  </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[180px]">지원자 정보</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[180px]">지원 공고</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">중복 여부</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AI 분석</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">지원일</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">전형 상태</th>
                    <th className="px-6 py-5 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(applicant.id)}
                          onChange={() => toggleSelect(applicant.id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-200 shadow-sm overflow-hidden">
                              {applicant.name[0]}
                            </div>
                            {applicant.isNew && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-700">{applicant.name}</span>
                              {applicant.isNew && (
                                <span className="text-[8px] font-black bg-red-50 text-red-500 px-1 rounded border border-red-100 uppercase tracking-tighter">New</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{applicant.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-slate-600 line-clamp-1">{applicant.job}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {getDuplicateCount(applicant) > 1 ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-[10px] font-black tracking-tighter">⚠️ {getDuplicateCount(applicant)}건 지원</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {analysisResults[applicant.id] ? (
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black tracking-tight",
                            analysisResults[applicant.id].aiSuspicion > 70 ? "bg-red-50 text-red-600" :
                            analysisResults[applicant.id].aiSuspicion > 40 ? "bg-amber-50 text-amber-600" :
                            "bg-green-50 text-green-600"
                          )}>
                            <span>{analysisResults[applicant.id].aiSuspicion > 70 ? '🔴 높음' : analysisResults[applicant.id].aiSuspicion > 40 ? '🟡 검토' : '🟢 낮음'}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300">미분석</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm text-slate-400 font-mono tracking-tight">{applicant.date}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight border",
                          applicant.status === '심사중' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          applicant.status.includes('합격') ? 'bg-green-50 text-green-600 border-green-100' :
                          applicant.status.includes('불합격') ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-slate-50 text-slate-400 border-slate-100'
                        )}>
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[11px] font-bold text-slate-400 font-mono italic">{applicant.id}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button 
                            disabled={!applicant.data}
                            onClick={() => setViewingApplicantPanel({ applicant, mode: 'DOCS', tab: 'intro' })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-primary hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-sm"
                            title="서류보기"
                          >
                            <FileSearch className="w-3.5 h-3.5" />
                            서류보기
                          </button>
                          <button 
                            disabled={!applicant.data}
                            onClick={() => {
                              setViewingApplicantPanel({ applicant, mode: 'AI', tab: 'analysis' });
                              analyzeApplicant(applicant.id, applicant);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-white hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            title="AI 요약분석"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            요약분석
                          </button>
                          <button 
                            onClick={() => exportToPDF(applicant)}
                            className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-1"
                            title="PDF 다운로드"
                          >
                            {isExporting && exportTarget?.id === applicant.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="col-span-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Inquiry Filter Section */}
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-slate-800">1:1 문의 관리</h2>
                  <div className="flex gap-2">
                     {['ALL', 'PENDING', 'DONE'].map(f => (
                       <button 
                        key={f}
                        onClick={() => setInquiryStatusFilter(f as any)}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all",
                          inquiryStatusFilter === f ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                       >
                         {f === 'ALL' ? '전체' : f === 'PENDING' ? '미답변' : '완료'}
                       </button>
                     ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                    <input 
                      type="text" 
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="이름 / 제목 / 내용 검색"
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all w-64"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                 <div className="flex p-1 bg-slate-100 rounded-xl">
                   {['ALL', 'PUBLIC', 'PRIVATE'].map(v => (
                     <button 
                      key={v}
                      onClick={() => setInquiryVisibilityFilter(v as any)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                        inquiryVisibilityFilter === v ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                     >
                       {v === 'ALL' ? '전체 공개여부' : v === 'PUBLIC' ? '공개' : '비공개(🔒)'}
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-16">번호</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">제목</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-24">작성자</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-20">상태</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-20">공개여부</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-32">작성일</th>
                    <th className="px-6 py-4 w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInquiries.map((inquiry, idx) => (
                    <tr 
                      key={inquiry.id} 
                      onClick={() => handleView(inquiry)}
                      className={cn(
                        "hover:bg-slate-50 transition-colors group cursor-pointer",
                        viewingInquiry?.id === inquiry.id ? "bg-primary/[0.03] border-l-4 border-l-primary" : ""
                      )}
                    >
                      <td className="px-6 py-5 text-xs font-medium text-slate-400 text-center">{inquiries.length - idx}</td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5">
                             <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/5 rounded">{inquiry.category}</span>
                             <span className="text-sm font-bold text-slate-700">{inquiry.title}</span>
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600 text-center">
                        {inquiry.publicName ? inquiry.author : <span className="text-slate-300">비공개</span>}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {inquiry.answer ? (
                          <span className="px-2 py-1 bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold rounded-full">답변완료</span>
                        ) : (
                          <div className="relative inline-flex items-center">
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold rounded-full uppercase">미답변</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                         {inquiry.password ? <Lock className="w-3.5 h-3.5 text-orange-400 mx-auto" /> : <Unlock className="w-3.5 h-3.5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-400 font-mono text-center">{inquiry.createdAt}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[10px] font-bold text-primary hover:underline">
                          {inquiry.answer ? '보기' : '답변'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Pagination */}
        {!viewingInquiry && (
          <div className="col-span-12 p-6 border-t border-slate-100 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">
              {activeTab === 'applicants' ? `Showing ${filteredApplicants.length} of 1,240 results` : `Showing ${filteredInquiries.length} results`}
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400">Prev</button>
              <button className="px-3 py-1 bg-primary text-white border border-primary rounded text-xs font-bold">1</button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600">2</button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail/Reply Sidebar */}
      <AnimatePresence>
        {viewingInquiry && activeTab === 'inquiries' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="col-span-12 lg:col-span-5 space-y-6"
          >
            <div className="bento-card p-0 flex flex-col h-full sticky top-24">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800">문의 상세 & 답변</h3>
                 <button 
                  onClick={() => setViewingInquiry(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                 >
                   <ChevronDown className="w-5 h-5 rotate-90" />
                 </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                {/* Inquiry Detail */}
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">{viewingInquiry.category}</span>
                      <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">No.{viewingInquiry.id}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                        <User className="w-3 h-3" /> {viewingInquiry.author}
                      </div>
                   </div>
                   <h4 className="font-bold text-slate-900 text-lg">{viewingInquiry.title}</h4>
                   <div className="p-4 bg-slate-50 rounded-2xl text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                     {viewingInquiry.content}
                   </div>
                </div>

                <hr className="border-slate-100" />

                {/* Reply Area */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                       <Reply className="w-4 h-4 text-primary" />
                       답변 작성
                     </h4>
                     {viewingInquiry.answer && viewingInquiry.answeredAt && (
                       <span className="text-[10px] font-medium text-slate-400">최종답변: {viewingInquiry.answeredAt}</span>
                     )}
                   </div>

                   {/* Templates */}
                   <div className="flex flex-wrap gap-2">
                     {TEMPLATES.map((t, idx) => (
                       <button 
                        key={idx}
                        onClick={() => setReplyText(prev => prev + t + " ")}
                        className="text-[10px] font-bold text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded-lg hover:border-primary hover:text-primary transition-all"
                       >
                         {t.slice(0, 10)}...
                       </button>
                     ))}
                   </div>

                   <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="지원자에게 답변할 내용을 입력해주세요."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[200px] resize-none"
                   />

                   <div className="flex gap-3">
                      <button 
                        onClick={() => setViewingInquiry(null)}
                        className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                      >
                        취소
                      </button>
                      <button 
                        onClick={submitReply}
                        disabled={!replyText.trim()}
                        className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary shadow-lg shadow-primary/20 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        답변 등록하기
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>

      {/* Integrated PDF Settings Modal */}
      <AnimatePresence>
        {isSummaryModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">통합 PDF 다운로드 설정</h3>
                <button onClick={() => setIsSummaryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                   <ChevronDown className="w-6 h-6 rotate-180" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">출력 형식</p>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                        onClick={() => setSummaryConfig(prev => ({ ...prev, type: 'LIST' }))}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                          summaryConfig.type === 'LIST' ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                        )}
                       >
                         <span className={cn("text-xs font-bold", summaryConfig.type === 'LIST' ? "text-primary" : "text-slate-700")}>목록형</span>
                         <span className="text-[10px] text-slate-400">인적사항 표 위주 요약</span>
                       </button>
                       <button 
                        onClick={() => setSummaryConfig(prev => ({ ...prev, type: 'DETAIL' }))}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                          summaryConfig.type === 'DETAIL' ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                        )}
                       >
                         <span className={cn("text-xs font-bold", summaryConfig.type === 'DETAIL' ? "text-primary" : "text-slate-700")}>상세 포함형</span>
                         <span className="text-[10px] text-slate-400">개별 요약 페이지 포함</span>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">블라인드 여부</p>
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                       <button 
                        onClick={() => setSummaryConfig(prev => ({ ...prev, isBlind: true }))}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                          summaryConfig.isBlind ? "bg-white text-primary shadow-sm" : "text-slate-400"
                        )}
                       >
                         적용 (🔒)
                       </button>
                       <button 
                        onClick={() => setSummaryConfig(prev => ({ ...prev, isBlind: false }))}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                          !summaryConfig.isBlind ? "bg-white text-primary shadow-sm" : "text-slate-400"
                        )}
                       >
                         미적용
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      * 적용 시 이름(익명), 생년(연도만), 이메일 및 주소 비공개, 학교명 블라인드 처리가 수행됩니다.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-slate-50 flex gap-3">
                 <button 
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                 >
                   취소
                 </button>
                 <button 
                  onClick={exportSummaryPDF}
                  disabled={isExportingSummary}
                  className="flex-[2] py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2"
                 >
                   {isExportingSummary ? (
                     <Loader2 className="w-4 h-4 animate-spin" />
                   ) : (
                     <Download className="w-4 h-4" />
                   )}
                   {isExportingSummary ? '생성 중...' : 'PDF 다운로드'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        {isSummaryModalOpen && (
          <SummaryPDF 
            ref={summaryRef}
            jobTitle={filterJob}
            applicants={filteredApplicants}
            isBlind={summaryConfig.isBlind}
            type={summaryConfig.type}
          />
        )}
      </div>

      {/* Job Announcement Registration Form */}
      <AnimatePresence>
        {isJobFormOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[400] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest">Step {jobFormStep} of 5</span>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{editingJob ? '공고 수정' : '신규 공고 등록'}</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">구성요소 기반 자동 공고문 생성 시스템</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-1">
                         {[1,2,3,4,5].map(step => (
                           <div key={step} className={cn(
                             "w-8 h-1.5 rounded-full transition-all",
                             jobFormStep === step ? "bg-primary w-12" : jobFormStep > step ? "bg-primary/30" : "bg-slate-100"
                           )} />
                         ))}
                      </div>
                      <button 
                        onClick={() => setIsJobFormOpen(false)}
                        className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all ml-4"
                      >
                        <ChevronDown className="w-6 h-6 rotate-180" />
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 bg-slate-50/30">
                   {/* Step 1: Basic Info */}
                   {jobFormStep === 1 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                           <div className="col-span-2 space-y-2">
                              <label className="text-xs font-black text-slate-500 ml-1">공고명 *</label>
                              <input 
                                type="text"
                                value={jobForm.title || ''}
                                onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="예: 2026년 상반기 정규직 공개채용"
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 ml-1">채용유형 *</label>
                              <div className="flex p-1 bg-white border border-slate-200 rounded-2xl">
                                 {['연구직', '행정직', '위촉연구원'].map(type => (
                                   <button 
                                    key={type}
                                    onClick={() => setJobForm(prev => ({ ...prev, category: type as any }))}
                                    className={cn(
                                      "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                                      jobForm.category === type ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                                    )}
                                   >
                                     {type}
                                   </button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-slate-500 ml-1">채용구분 *</label>
                              <select 
                                value={jobForm.type || '정규직'}
                                onChange={(e) => setJobForm(prev => ({ ...prev, type: e.target.value as any }))}
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 appearance-none bg-[url('https://api.iconify.design/lucide:chevron-down.svg')] bg-[length:1.2rem] bg-[right_1.5rem_center] bg-no-repeat"
                              >
                                 <option value="정규직">정규직</option>
                                 <option value="계약직">계약직</option>
                                 <option value="무기계약직">무기계약직</option>
                              </select>
                           </div>
                           <div className="col-span-2 space-y-2">
                              <label className="text-xs font-black text-slate-500 ml-1">공고 요약 설명 (내부 관리용)</label>
                              <textarea 
                                value={jobForm.description || ''}
                                onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="채용 목적 및 주요 타겟 등을 간략히 입력하세요."
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all h-32 resize-none"
                              />
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {/* Step 2: Recruitment Fields */}
                   {jobFormStep === 2 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                           <h4 className="text-lg font-black text-slate-800">모집 분야 설정</h4>
                           <button 
                             onClick={() => setJobForm(prev => ({ ...prev, fields: [...(prev.fields || []), { id: `f_${Date.now()}`, name: '', major: '', slots: 0, content: '' }] }))}
                             className="text-xs font-black text-primary px-4 py-2 border-2 border-primary/20 rounded-xl hover:bg-primary/5 transition-all flex items-center gap-2"
                           >
                              <PlusCircle className="w-3.5 h-3.5" /> 분야 추가
                           </button>
                        </div>

                        <div className="space-y-6">
                           {jobForm.fields?.map((field, idx) => (
                             <div key={field.id} className="p-8 bg-white border border-slate-200 rounded-3xl space-y-4 relative group shadow-sm">
                                <button 
                                  onClick={() => setJobForm(prev => ({ ...prev, fields: prev.fields?.filter(f => f.id !== field.id) }))}
                                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                   <MinusCircle className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-3 gap-6">
                                   <div className="space-y-1.5">
                                      <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">모집분야명</label>
                                      <input 
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => {
                                          const newFields = [...(jobForm.fields || [])];
                                          newFields[idx].name = e.target.value;
                                          setJobForm(prev => ({ ...prev, fields: newFields }));
                                        }}
                                        placeholder="예: 도시행정"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                                      />
                                   </div>
                                   <div className="space-y-1.5">
                                      <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">전공 요건</label>
                                      <input 
                                        type="text"
                                        value={field.major}
                                        onChange={(e) => {
                                          const newFields = [...(jobForm.fields || [])];
                                          newFields[idx].major = e.target.value;
                                          setJobForm(prev => ({ ...prev, fields: newFields }));
                                        }}
                                        placeholder="예: 행정학, 경영학"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                                      />
                                   </div>
                                   <div className="space-y-1.5">
                                      <label className="text-[10px] font-black text-slate-400 ml-1 uppercase">모집인원</label>
                                      <input 
                                        type="number"
                                        value={field.slots}
                                        onChange={(e) => {
                                          const newFields = [...(jobForm.fields || [])];
                                          newFields[idx].slots = parseInt(e.target.value);
                                          setJobForm(prev => ({ ...prev, fields: newFields }));
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                                      />
                                   </div>
                                   <div className="col-span-3 space-y-1.5">
                                      <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-wider">직무내용</label>
                                      <textarea 
                                        value={field.content}
                                        onChange={(e) => {
                                          const newFields = [...(jobForm.fields || [])];
                                          newFields[idx].content = e.target.value;
                                          setJobForm(prev => ({ ...prev, fields: newFields }));
                                        }}
                                        placeholder="주요 수행 업무 및 역할을 기술하세요."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all h-20 resize-none"
                                      />
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </motion.div>
                   )}

                   {/* Step 3: Stage Settings */}
                   {jobFormStep === 3 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="space-y-4">
                           <h4 className="text-lg font-black text-slate-800">전형 단계 구성</h4>
                           <p className="text-xs text-slate-500 font-medium">채용 직종에 따라 전형 구성이 자동으로 조절되지만, 수동으로 편집할 수 있습니다.</p>
                           <div className="grid grid-cols-4 gap-4">
                              {[
                                { id: 'DOCUMENT', label: '1차 서류심사', icon: FileText },
                                { id: 'INTERVIEW_1', label: '면접/세미나', icon: Users },
                                { id: 'INTERVIEW_PT', label: 'PT 발표', icon: TrendingUp },
                                { id: 'INTERVIEW_2', label: '최종 면접', icon: Check }
                              ].map(stage => {
                                const isSelected = jobForm.selectedStages?.includes(stage.id as any);
                                return (
                                  <button 
                                    key={stage.id}
                                    onClick={() => {
                                      const current = jobForm.selectedStages || [];
                                      if (isSelected) setJobForm(prev => ({ ...prev, selectedStages: current.filter(s => s !== stage.id) }));
                                      else setJobForm(prev => ({ ...prev, selectedStages: [...current, stage.id as any] }));
                                    }}
                                    className={cn(
                                      "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group",
                                      isSelected ? "border-primary bg-primary/[0.03]" : "border-white bg-white hover:border-slate-200"
                                    )}
                                  >
                                     <div className={cn(
                                       "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                       isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                                     )}>
                                        <stage.icon className="w-5 h-5" />
                                     </div>
                                     <span className={cn("text-xs font-black transition-colors", isSelected ? "text-primary" : "text-slate-500")}>
                                       {stage.label}
                                     </span>
                                     <div className={cn(
                                       "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                       isSelected ? "border-primary bg-primary text-white" : "border-slate-100"
                                     )}>
                                        {isSelected && <Check className="w-3 h-3" />}
                                     </div>
                                  </button>
                                );
                              })}
                           </div>
                        </div>

                        <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-3xl space-y-4">
                           <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              <h5 className="text-sm font-black text-amber-800 tracking-tight">AI 전형 최적화 제안</h5>
                           </div>
                           <p className="text-xs text-amber-700/70 font-medium leading-relaxed">
                              선택하신 <span className="font-bold text-amber-800">[{jobForm.category}]</span> 유형은 통상적으로 
                              {jobForm.category === '연구직' ? ' [서류 → PT → 면접]' : ' [서류 → 면접]'} 단계를 권장합니다. 
                              현재 설정은 {jobForm.selectedStages?.length}개 단계로 구성되어 있습니다.
                           </p>
                        </div>
                     </motion.div>
                   )}

                   {/* Step 4: Qualifications & Documents */}
                   {jobFormStep === 4 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">응시 자격 (공통/추가)</label>
                              <div className="space-y-4">
                                 <textarea 
                                   value={jobForm.qualifications?.common}
                                   onChange={(e) => setJobForm(prev => ({ ...prev, qualifications: { ...(prev.qualifications || {common:'', additional:''}), common: e.target.value } }))}
                                   placeholder="공통 자격 (자동 삽입됨)"
                                   className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all h-24 resize-none"
                                 />
                                 <textarea 
                                   value={jobForm.qualifications?.additional}
                                   onChange={(e) => setJobForm(prev => ({ ...prev, qualifications: { ...(prev.qualifications || {common:'', additional:''}), additional: e.target.value } }))}
                                   placeholder="추가 개별 자격 (예: 학사 이상, 관련 전공자 등)"
                                   className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all h-40 resize-none border-dashed"
                                 />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">제출 서류 설정</label>
                              <div className="grid grid-cols-2 gap-3">
                                 {['응시원서', '자기소개서', '직무수행계획서', '연구실적물', '경력증명서', '최종학위증명서', '자격증 사본', '어학성적표'].map(doc => {
                                   const isSelected = jobForm.requiredDocuments?.includes(doc);
                                   return (
                                     <button 
                                      key={doc}
                                      onClick={() => {
                                        const current = jobForm.requiredDocuments || [];
                                        if (isSelected) setJobForm(prev => ({ ...prev, requiredDocuments: current.filter(d => d !== doc) }));
                                        else setJobForm(prev => ({ ...prev, requiredDocuments: [...current, doc] }));
                                      }}
                                      className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                        isSelected ? "border-slate-800 bg-slate-800 text-white" : "border-slate-200 bg-white hover:border-slate-400 text-slate-500"
                                      )}
                                     >
                                        <div className={cn(
                                          "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                                          isSelected ? "border-white bg-white text-slate-800" : "border-slate-200"
                                        )}>
                                          {isSelected && <Check className="w-3 h-3" />}
                                        </div>
                                        <span className="text-xs font-bold truncate">{doc}</span>
                                     </button>
                                   );
                                 })}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">선택된 서류들이 공고문에 자동으로 나열됩니다.</p>
                           </div>
                        </div>
                     </motion.div>
                   )}

                   {/* Step 5: Schedule & Notice */}
                   {jobFormStep === 5 && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                        <div className="space-y-6">
                           <h4 className="text-lg font-black text-slate-800">전형 일정 및 보수</h4>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">공고 기간</label>
                                 <div className="flex items-center gap-2">
                                    <input 
                                       type="date" 
                                       value={jobForm.schedule?.postingPeriod?.start || ''} 
                                       onChange={(e) => {
                                          const val = e.target.value;
                                          setJobForm(prev => ({
                                             ...prev,
                                             schedule: {
                                                ...(prev.schedule || { postingPeriod: { start: '', end: '' }, applicationPeriod: { start: '', end: '' }, documentResults: '', interview1: '', finalResults: '' }),
                                                postingPeriod: { ...(prev.schedule?.postingPeriod || { start: '', end: '' }), start: val }
                                             }
                                          }));
                                       }}
                                       className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                                    />
                                    <span className="text-slate-300">~</span>
                                    <input 
                                       type="date" 
                                       value={jobForm.schedule?.postingPeriod?.end || ''} 
                                       onChange={(e) => {
                                          const val = e.target.value;
                                          setJobForm(prev => ({
                                             ...prev,
                                             schedule: {
                                                ...(prev.schedule || { postingPeriod: { start: '', end: '' }, applicationPeriod: { start: '', end: '' }, documentResults: '', interview1: '', finalResults: '' }),
                                                postingPeriod: { ...(prev.schedule?.postingPeriod || { start: '', end: '' }), end: val }
                                             }
                                          }));
                                       }}
                                       className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">접수 기간</label>
                                 <div className="flex items-center gap-2">
                                    <input 
                                       type="date" 
                                       value={jobForm.schedule?.applicationPeriod?.start || ''} 
                                       onChange={(e) => {
                                          const val = e.target.value;
                                          setJobForm(prev => ({
                                             ...prev,
                                             schedule: {
                                                ...(prev.schedule || { postingPeriod: { start: '', end: '' }, applicationPeriod: { start: '', end: '' }, documentResults: '', interview1: '', finalResults: '' }),
                                                applicationPeriod: { ...(prev.schedule?.applicationPeriod || { start: '', end: '' }), start: val }
                                             }
                                          }));
                                       }}
                                       className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                                    />
                                    <span className="text-slate-300">~</span>
                                    <input 
                                       type="date" 
                                       value={jobForm.schedule?.applicationPeriod?.end || ''} 
                                       onChange={(e) => {
                                          const val = e.target.value;
                                          setJobForm(prev => ({
                                             ...prev,
                                             schedule: {
                                                ...(prev.schedule || { postingPeriod: { start: '', end: '' }, applicationPeriod: { start: '', end: '' }, documentResults: '', interview1: '', finalResults: '' }),
                                                applicationPeriod: { ...(prev.schedule?.applicationPeriod || { start: '', end: '' }), end: val }
                                             }
                                          }));
                                       }}
                                       className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1차 발표일</label>
                                 <input 
                                    type="date" 
                                    value={jobForm.schedule?.documentResults || ''} 
                                    onChange={(e) => {
                                       const val = e.target.value;
                                       setJobForm(prev => ({
                                          ...prev,
                                          schedule: {
                                             ...(prev.schedule || { postingPeriod: { start: '', end: '' }, applicationPeriod: { start: '', end: '' }, documentResults: '', interview1: '', finalResults: '' }),
                                             documentResults: val
                                          }
                                       }));
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">보수(연봉) 정보</label>
                                 <input 
                                    type="text" 
                                    value={jobForm.salaryInfo} 
                                    onChange={(e) => setJobForm(prev => ({ ...prev, salaryInfo: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold" 
                                    placeholder="예: 연 3,600만원 이상" 
                                 />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">공고 유의사항</label>
                           <textarea 
                             value={jobForm.notice}
                             onChange={(e) => setJobForm(prev => ({ ...prev, notice: e.target.value }))}
                             className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all h-32 resize-none"
                           />
                        </div>
                     </motion.div>
                   )}
                </div>

                {/* Footer Navigation */}
                <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between sticky bottom-0">
                   <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          // Logic for AI refinement
                          alert('AI가 공고 문구의 어색한 부분을 다듬고 있습니다...');
                        }}
                        className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-primary transition-all flex items-center gap-2"
                        title="AI 문장 다듬기"
                      >
                         <Sparkles className="w-5 h-5" />
                         <span className="text-xs font-black">AI 보정</span>
                      </button>
                      <button 
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
                      >
                         <Eye className="w-4 h-4" />
                         미리보기
                      </button>
                   </div>

                   <div className="flex gap-4">
                      {jobFormStep > 1 && (
                        <button 
                          onClick={() => setJobFormStep(prev => prev - 1)}
                          className="px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-400 hover:bg-slate-50 transition-all"
                        >
                          이전 단계
                        </button>
                      )}
                      
                      {jobFormStep < 5 ? (
                        <button 
                          onClick={() => setJobFormStep(prev => prev + 1)}
                          className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-secondary transition-all"
                        >
                          다음 단계
                        </button>
                      ) : (
                        <button 
                          onClick={saveJob}
                          className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                        >
                          최종 저장 및 게시
                        </button>
                      )}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Announcement Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[500] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#fefefe] rounded-none shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] border-8 border-slate-200"
             >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-4">공고문 최종 미리보기</h3>
                   <div className="flex gap-2">
                     <button 
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF/인쇄
                      </button>
                      <button 
                        onClick={() => setIsPreviewOpen(false)}
                        className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all font-black text-xs px-4"
                      >
                        닫기
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 lg:p-20 space-y-16 text-slate-900 font-serif leading-relaxed">
                   {/* Announcement Header */}
                   <div className="text-center space-y-6">
                      <p className="text-lg font-bold text-slate-700 tracking-[0.2em] border-b-2 border-slate-900 inline-block pb-2">수원시정연구원 공고 제2026-00호</p>
                      <h1 className="text-4xl font-black tracking-tight leading-tight pt-4">
                        {jobForm.title || '[공고명이 입력되지 않았습니다]'}
                      </h1>
                   </div>

                   {/* Main Content */}
                   <div className="space-y-12">
                      <section className="space-y-4">
                         <h2 className="text-xl font-bold flex items-center gap-3">
                           <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs">1</span>
                           모집분야 및 인원
                         </h2>
                         <div className="border-t-2 border-slate-900 overflow-hidden">
                           <table className="w-full text-sm border-collapse">
                             <thead>
                               <tr className="bg-slate-50">
                                 <th className="border border-slate-200 px-4 py-3 text-center w-24">유형</th>
                                 <th className="border border-slate-200 px-4 py-3 text-center">모집분야</th>
                                 <th className="border border-slate-200 px-4 py-3 text-center w-32">전공요건</th>
                                 <th className="border border-slate-200 px-4 py-3 text-center w-20">인원</th>
                               </tr>
                             </thead>
                             <tbody>
                                {jobForm.fields?.map(f => (
                                  <tr key={f.id}>
                                    <td className="border border-slate-200 px-4 py-4 text-center font-bold">{jobForm.category || '연구직'}</td>
                                    <td className="border border-slate-200 px-4 py-4">
                                       <p className="font-bold">{f.name}</p>
                                       <p className="text-xs text-slate-500 mt-1">{f.content}</p>
                                    </td>
                                    <td className="border border-slate-200 px-4 py-4 text-center">{f.major}</td>
                                    <td className="border border-slate-200 px-4 py-4 text-center font-mono">{f.slots}명</td>
                                  </tr>
                                ))}
                             </tbody>
                           </table>
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h2 className="text-xl font-bold flex items-center gap-3">
                           <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs">2</span>
                           응시자격
                         </h2>
                         <div className="space-y-4 pl-9 text-base">
                            <div className="space-y-2">
                               <p className="font-bold">가. 공통자격</p>
                               <div className="pl-4 border-l-2 border-slate-100 italic text-slate-600 whitespace-pre-wrap">
                                 {jobForm.qualifications?.common}
                               </div>
                            </div>
                            {jobForm.qualifications?.additional && (
                              <div className="space-y-2">
                                <p className="font-bold">나. 개별자격 및 우대사항</p>
                                <div className="pl-4 border-l-2 border-slate-100 whitespace-pre-wrap">
                                  {jobForm.qualifications?.additional}
                                </div>
                              </div>
                            )}
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h2 className="text-xl font-bold flex items-center gap-3">
                           <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs">3</span>
                           전형방법 및 일정
                         </h2>
                         <div className="pl-9 space-y-6">
                            <div className="space-y-2">
                               <p className="font-bold">가. 전형절차</p>
                               <div className="flex items-center gap-4 text-sm font-bold bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  {jobForm.selectedStages?.map((stage, idx) => (
                                    <React.Fragment key={stage}>
                                       <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                         {stage === 'DOCUMENT' ? '1차 서류심사' : 
                                          stage === 'INTERVIEW_1' ? '2차 면접/세미나' : 
                                          stage === 'INTERVIEW_PT' ? 'PT 발표' : '최종 면접'}
                                       </span>
                                       {idx < jobForm.selectedStages.length - 1 && <ChevronDown className="w-4 h-4 -rotate-90 text-slate-300" />}
                                    </React.Fragment>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <p className="font-bold">나. 전형일정</p>
                               <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                                  <li>공고 및 접수: {jobForm.schedule?.applicationPeriod.start} ~ {jobForm.schedule?.applicationPeriod.end}</li>
                                  <li>1차 결과 발표: {jobForm.schedule?.documentResults || '별도 고지'} (예정)</li>
                                  <li>장소 및 시간: 연구원 홈페이지 게시 및 개별 통보</li>
                               </ul>
                            </div>
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h2 className="text-xl font-bold flex items-center gap-3">
                           <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs">4</span>
                           제출서류
                         </h2>
                         <div className="pl-9 grid grid-cols-2 gap-2 text-sm font-medium">
                            {jobForm.requiredDocuments?.map((doc, idx) => (
                              <div key={doc} className="flex gap-2">
                                <span className="text-slate-300">{idx + 1}.</span>
                                <span>{doc}</span>
                              </div>
                            ))}
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h2 className="text-xl font-bold flex items-center gap-3">
                           <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center text-xs">5</span>
                           기타 및 유의사항
                         </h2>
                         <div className="pl-9 text-base whitespace-pre-wrap leading-relaxed text-slate-600 bg-slate-50/50 p-8 rounded-3xl">
                            {jobForm.notice}
                         </div>
                      </section>
                   </div>

                   {/* Footer Sign */}
                   <div className="text-center pt-20 pb-10 space-y-10">
                      <p className="text-xl font-bold tracking-widest">{new Date().getFullYear()}년 {new Date().getMonth()+1}월</p>
                      <h2 className="text-3xl font-black tracking-[0.4em] uppercase py-8">수원시정연구원장</h2>
                   </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white shadow-2xl z-20 sticky bottom-0 text-center">
                   <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-20 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all uppercase tracking-widest"
                   >
                     확인 및 닫기
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Judge Pool Drawer */}
      <AnimatePresence>
        {isJudgePoolOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                   <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">심사위원 인력풀 관리</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1">심사위원을 등록하고 현재 전형({evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.title || '전형 선택됨'})에 배정합니다.</p>
                   </div>
                   <button 
                    onClick={() => setIsJudgePoolOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                   >
                     <ChevronDown className="w-6 h-6 rotate-180" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="relative flex-1 max-w-xs">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                         <input 
                            type="text" 
                            placeholder="위원 검색 (이름/소속)"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                         />
                      </div>
                      <button 
                        onClick={() => {
                            setEditingJudge(null);
                            setJudgeFormData({ name: '', affiliation: '', position: '' });
                            setIsJudgeModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
                      >
                         <PlusCircle className="w-4 h-4" />
                         신규 심사위원 등록
                      </button>
                   </div>

                   <div className="grid gap-3">
                      {masterJudges.map(judge => {
                         const isSelectedInCurrentStage = evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.judges?.some(j => j.id === judge.id);
                         return (
                            <div 
                                key={judge.id} 
                                className={cn(
                                    "flex items-center justify-between p-5 bg-slate-50 rounded-3xl border-2 transition-all group cursor-pointer hover:bg-white",
                                    isSelectedInCurrentStage ? "border-primary bg-primary/5" : "border-transparent"
                                )}
                                onClick={() => toggleJudgeSelection(judge)}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={cn(
                                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all",
                                      isSelectedInCurrentStage ? "bg-primary text-white" : "bg-white text-slate-300 border border-slate-100"
                                  )}>
                                     {judge.name[0]}
                                  </div>
                                  <div>
                                     <p className="font-extrabold text-slate-800">{judge.name}</p>
                                     <p className="text-xs text-slate-500 font-medium">{judge.affiliation} · {judge.position}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-2">
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingJudge(judge);
                                        setJudgeFormData({ name: judge.name, affiliation: judge.affiliation, position: judge.position });
                                        setIsJudgeModalOpen(true);
                                    }}
                                    className="p-2 text-slate-300 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                  >
                                     <Settings2 className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteJudge(judge.id);
                                    }}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                  >
                                     <Trash2 className="w-5 h-5" />
                                  </button>
                                  <div className={cn(
                                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                      isSelectedInCurrentStage ? "border-primary bg-primary" : "border-slate-200"
                                  )}>
                                     {isSelectedInCurrentStage && <Check className="w-3.5 h-3.5 text-white" />}
                                  </div>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                   <button 
                    onClick={() => setIsJudgePoolOpen(false)}
                    className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                   >
                     배정 완료
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Judge Modal */}
      <AnimatePresence>
        {isJudgeModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden"
             >
                <form onSubmit={handleSaveJudge}>
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">
                            {editingJudge ? '심사위원 정보 수정' : '신규 심사위원 추가'}
                        </h3>
                    </div>
                    <div className="p-8 space-y-5">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">이름 *</label>
                          <input 
                            type="text" 
                            required
                            value={judgeFormData.name}
                            onChange={(e) => setJudgeFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="성함"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">소속 *</label>
                          <input 
                            type="text" 
                            required
                            value={judgeFormData.affiliation}
                            onChange={(e) => setJudgeFormData(prev => ({ ...prev, affiliation: e.target.value }))}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="기관/부서명"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">직급 *</label>
                          <input 
                            type="text" 
                            required
                            value={judgeFormData.position}
                            onChange={(e) => setJudgeFormData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="직위 (예: 교수)"
                          />
                       </div>

                       {judgeFormError && <p className="text-[10px] font-bold text-red-500 mt-2 ml-1">{judgeFormError}</p>}
                    </div>
                    <div className="p-8 bg-slate-50 flex gap-3">
                       <button 
                        type="button"
                        onClick={() => setIsJudgeModalOpen(false)}
                        className="flex-1 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                       >
                         취소
                       </button>
                       <button 
                         type="submit"
                         className="flex-1 py-3.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/10 hover:bg-secondary transition-all"
                       >
                         저장하기
                       </button>
                    </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Evaluating Applicant Modal */}
      <AnimatePresence>
        {evaluatingApplicantId && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-end">
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
             >
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl">
                      {applicantsList.find(a => a.id === evaluatingApplicantId)?.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">
                        {applicantsList.find(a => a.id === evaluatingApplicantId)?.name} 심사 진행
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.title}
                         </span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full" />
                         <select 
                           value={evalForm.judgeId}
                           onChange={(e) => setEvalForm(prev => ({ ...prev, judgeId: e.target.value }))}
                           className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 outline-none"
                         >
                            {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.judges?.map(j => (
                                <option key={j.id} value={j.id}>{j.name} 위원</option>
                            ))}
                         </select>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEvaluatingApplicantId(null)}
                    className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-200"
                  >
                    <ChevronDown className="w-6 h-6 rotate-90" />
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  {/* Step 1: Qualification */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">01</div>
                       <h4 className="font-bold text-slate-800">자격 판단</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                           <div>
                              <p className="text-sm font-bold text-slate-700">공통 및 응시 자격 확인</p>
                              <p className="text-[10px] text-slate-400 font-medium">거주지, 학위, 전공 등 필수 요건 적격 여부</p>
                           </div>
                           <div className="flex gap-2">
                             {[
                               { v: true, label: '적격', color: 'blue' },
                               { v: false, label: '부적격', color: 'red' }
                             ].map(item => (
                               <button 
                                key={item.label}
                                onClick={() => setEvalForm(prev => ({ ...prev, isEligible: item.v }))}
                                className={cn(
                                  "px-6 py-2 rounded-xl text-xs font-black transition-all border-2",
                                  evalForm.isEligible === item.v 
                                    ? item.color === 'blue' ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                )}
                               >
                                 {item.label}
                               </button>
                             ))}
                           </div>
                        </div>
                    </div>
                  </section>

                  {/* Step 2: Scoring */}
                  <section className={cn("space-y-6 transition-opacity duration-300", !evalForm.isEligible && "opacity-30 pointer-events-none")}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">02</div>
                         <h4 className="font-bold text-slate-800">정성/정량 점수 평가</h4>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent-foreground rounded-lg text-[10px] font-black uppercase tracking-widest border border-accent/30 hover:bg-accent/30 transition-all">
                         <Sparkles className="w-3 h-3" />
                         Gemini 요약 요청
                      </button>
                    </div>
                    
                    <div className="grid gap-4">
                       {evaluationStages[activeEvalJob]?.find(s => s.type === activeEvalStageType)?.criteria?.map(c => (
                         <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group focus-within:border-primary/30 transition-all">
                            <div className="flex-1">
                               <p className="text-sm font-bold text-slate-700">{c.label}</p>
                               <p className="text-[10px] text-slate-400 font-medium">최대 {c.maxScore}점</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <input 
                                  type="number" 
                                  min="0" 
                                  max={c.maxScore}
                                  value={evalForm.scores[c.id] || 0}
                                  onChange={(e) => {
                                      const val = Math.min(c.maxScore, Math.max(0, parseInt(e.target.value) || 0));
                                      setEvalForm(prev => ({
                                          ...prev,
                                          scores: { ...prev.scores, [c.id]: val }
                                      }));
                                  }}
                                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-800 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                                <span className="text-xs font-bold text-slate-300">/ {c.maxScore}</span>
                            </div>
                         </div>
                       ))}
                       <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/10">
                          <p className="font-bold text-primary">평가 점수 합계</p>
                          <p className="text-2xl font-black text-primary">
                             {Object.values(evalForm.scores).reduce((a: number, b: number) => a + b, 0)}
                          </p>
                       </div>
                    </div>
                  </section>

                  {/* Step 3: Bonus & Comments */}
                  <section className={cn("space-y-6 transition-opacity duration-300", !evalForm.isEligible && "opacity-30 pointer-events-none")}>
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono">03</div>
                       <h4 className="font-bold text-slate-800">가산점 및 종합 의견</h4>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex gap-2">
                          {[0, 5, 10].map(v => (
                            <button 
                              key={v}
                              onClick={() => setEvalForm(prev => ({ ...prev, bonusRate: v as any }))}
                              className={cn(
                                "flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all",
                                evalForm.bonusRate === v 
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                              )}
                            >
                              {v === 0 ? '없음' : `${v}% 가산`}
                            </button>
                          ))}
                       </div>
                       <textarea 
                         value={evalForm.comment}
                         onChange={(e) => setEvalForm(prev => ({ ...prev, comment: e.target.value }))}
                         placeholder="지원자에 대한 종합 평가 의견을 작성하세요..."
                         className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[140px] resize-none"
                       />
                    </div>
                  </section>
               </div>

               <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => setEvaluatingApplicantId(null)}
                    className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-white/50 transition-all"
                  >
                    닫기
                  </button>
                  <button 
                    onClick={submitEvaluation}
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2"
                  >
                    심사 완료 및 제출하기
                  </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applicant Document & Analysis Panel */}
      <AnimatePresence>
        {viewingApplicantPanel && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingApplicantPanel(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h2 className="text-xl font-black text-slate-800">{viewingApplicantPanel.applicant.name}</h2>
                       <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">No.{viewingApplicantPanel.applicant.id}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400">{viewingApplicantPanel.applicant.job}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingApplicantPanel(null)}
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 border border-transparent hover:border-slate-200 transition-all"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </button>
              </div>

              {/* Panel Tabs */}
              <div className="px-6 py-4 flex gap-2 border-b border-slate-100 bg-slate-50/50">
                {[
                  { id: 'intro', label: '자기소개서', icon: FileText },
                  { id: 'plan', label: '직무수행계획', icon: BookOpen },
                  { id: 'files', label: '첨부파일', icon: FileDown },
                  { id: 'analysis', label: 'AI 요약분석', icon: Sparkles, color: 'text-amber-500' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => {
                        setViewingApplicantPanel(prev => prev ? { ...prev, tab: tab.id as any } : null);
                        if (tab.id === 'analysis') analyzeApplicant(viewingApplicantPanel.applicant.id, viewingApplicantPanel.applicant);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black tracking-tight transition-all",
                      viewingApplicantPanel.tab === tab.id 
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    )}
                  >
                    <tab.icon className={cn("w-3.5 h-3.5", tab.id === 'analysis' && "text-amber-400")} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Intro Tab */}
                {viewingApplicantPanel.tab === 'intro' && (
                  <div className="space-y-12">
                    {[
                      { title: '지원동기 및 포부', content: viewingApplicantPanel.applicant.data.intro.motive },
                      { title: '핵심 역량 및 강점', content: viewingApplicantPanel.applicant.data.intro.capability },
                      { title: '주요 경험 및 성과', content: viewingApplicantPanel.applicant.data.intro.experience },
                      { title: '직무 적합성', content: viewingApplicantPanel.applicant.data.intro.suitability }
                    ].map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-primary rounded-full" />
                           <h4 className="text-lg font-black text-slate-800">{section.title}</h4>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl text-sm font-medium text-slate-700 leading-relaxed overflow-hidden">
                           <p className="whitespace-pre-wrap">{section.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Plan Tab */}
                {viewingApplicantPanel.tab === 'plan' && (
                  <div className="space-y-12">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h4 className="text-lg font-black text-slate-800">직무수행계획서</h4>
                     </div>
                     <div className="space-y-6">
                        {[
                          { title: '수행 방향', content: viewingApplicantPanel.applicant.data.plan.direction },
                          { title: '역량 활용 방안', content: viewingApplicantPanel.applicant.data.plan.utilization },
                          { title: '기대 효과 및 공헌', content: viewingApplicantPanel.applicant.data.plan.contribution }
                        ].map((part, idx) => (
                          <div key={idx} className="space-y-2">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{part.title}</p>
                             <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium text-slate-700 leading-relaxed">
                                {part.content}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* Files Tab */}
                {viewingApplicantPanel.tab === 'files' && (
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h4 className="text-lg font-black text-slate-800">첨부 증빙 서류</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                         {viewingApplicantPanel.applicant.data.attachments.map((file: string, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary transition-all group cursor-pointer shadow-sm">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary/5">
                                   <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-slate-700">{file}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">Original File • 1.2MB</p>
                                </div>
                             </div>
                             <button className="p-2 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-lg transition-all">
                                <FileDown className="w-5 h-5" />
                             </button>
                           </div>
                         ))}
                         {viewingApplicantPanel.applicant.data.attachments.length === 0 && (
                           <div className="py-20 text-center space-y-2">
                              <AlertCircle className="w-10 h-10 text-slate-200 mx-auto" />
                              <p className="text-sm font-bold text-slate-400">제출된 첨부 서류가 없습니다.</p>
                           </div>
                         )}
                      </div>
                   </div>
                )}

                {/* Analysis Tab */}
                {viewingApplicantPanel.tab === 'analysis' && analysisResults[viewingApplicantPanel.applicant.id] && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Header Summary */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16" />
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-amber-400">AI 핵심 요약 분석</h4>
                      </div>
                      <div className="space-y-4">
                        {analysisResults[viewingApplicantPanel.applicant.id].summary.map((text: string, i: number) => (
                          <div key={i} className="flex gap-4 group">
                             <div className="w-1 h-auto bg-primary/30 group-hover:bg-primary rounded-full transition-all" />
                             <p className="text-sm font-medium leading-relaxed opacity-90">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       {/* Keywords */}
                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <Tag className="w-4 h-4 text-primary" />
                             <h4 className="text-sm font-black text-slate-800 tracking-tight">핵심 키워드</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {analysisResults[viewingApplicantPanel.applicant.id].keywords.map((tag: string) => (
                               <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black border border-slate-200/50 hover:bg-slate-100 transition-all cursor-default">#{tag}</span>
                             ))}
                          </div>
                       </div>
                       {/* Match */}
                       <div className="space-y-4">
                          <div className="flex items-center gap-2">
                             <Languages className="w-4 h-4 text-indigo-500" />
                             <h4 className="text-sm font-black text-slate-800 tracking-tight">직무 적합 매칭</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {analysisResults[viewingApplicantPanel.applicant.id].matchKeywords.map((tag: string) => (
                               <span key={tag} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black border border-indigo-100 flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3 h-3" />
                                 {tag}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: '문장 반복률', val: `${analysisResults[viewingApplicantPanel.applicant.id].metrics.repetitionRate}%`, color: 'blue' },
                         { label: '타 지원자 유사도', val: `${analysisResults[viewingApplicantPanel.applicant.id].metrics.similarity}%`, color: 'orange' },
                         { label: '정형문 비율', val: `${analysisResults[viewingApplicantPanel.applicant.id].metrics.formalRate}%`, color: 'purple' },
                         { label: 'AI 활용 의심도', val: `${analysisResults[viewingApplicantPanel.applicant.id].aiSuspicion}%`, color: 'red' }
                       ].map((s, idx) => (
                         <div key={idx} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <div className="flex items-center justify-between">
                              <h5 className="text-xl font-black text-slate-800">{s.val}</h5>
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                (idx === 3 && parseInt(s.val) > 70) ? "bg-red-500 animate-pulse" : 
                                (idx === 3 && parseInt(s.val) > 40) ? "bg-amber-500" : "bg-green-500"
                              )} />
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Evaluations */}
                    <div className="space-y-6 pt-4 border-t border-slate-100">
                       <h4 className="text-sm font-black text-slate-800 tracking-tight">AI 가독성 평가 상세</h4>
                       <div className="space-y-6">
                          {[
                            { label: '문장 간결성', score: analysisResults[viewingApplicantPanel.applicant.id].readability.conciseness },
                            { label: '내용 구체성', score: analysisResults[viewingApplicantPanel.applicant.id].readability.specificity },
                            { label: '경험 중심성', score: analysisResults[viewingApplicantPanel.applicant.id].readability.experienceBased }
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-2">
                               <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
                                  <span className="text-slate-600">{item.label}</span>
                                  <span className="text-primary">{item.score}%</span>
                               </div>
                               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.score}%` }}
                                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                                    className="h-full bg-primary"
                                  />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comprehensive Memo */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                 <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-800 tracking-tight uppercase">관리자 메모</h4>
                    <textarea 
                       value={memos[viewingApplicantPanel.applicant.id] || ''}
                       onChange={(e) => setMemos(prev => ({ ...prev, [viewingApplicantPanel.applicant.id]: e.target.value }))}
                       placeholder="심사 시 참고할 내용을 자유롭게 작성하세요..."
                       className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[80px] resize-none"
                    />
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Confirmation Popup */}
      <AnimatePresence>
        {isSignPopupOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden"
               >
                  <div className="p-8 border-b border-slate-50 bg-slate-50/50 text-center">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-primary" />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 tracking-tight">심사위원 확인 및 서명</h3>
                  </div>
                  
                  <div className="p-8 space-y-6">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500 leading-relaxed text-center">
                        "본인은 해당 평가가 본인의 전문적 판단과 양심에 따라 공정하게 이루어졌음을 확인하며, 이에 서명합니다."
                     </div>
                     
                     <div className="flex items-center justify-between px-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">서명자</p>
                        <p className="text-lg font-black text-slate-800">
                            {masterJudges.find(j => j.id === evalForm.judgeId)?.name} (인)
                        </p>
                     </div>

                     <label className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-primary/5 transition-all">
                        <input 
                          type="checkbox" 
                          checked={isSignAgreed}
                          onChange={(e) => setIsSignAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 leading-tight">위 내용을 충분히 확인하였으며, 최종 제출에 동의합니다.</span>
                     </label>
                  </div>

                  <div className="p-8 bg-slate-50 flex gap-3">
                     <button 
                       onClick={() => setIsSignPopupOpen(false)}
                       className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-400 hover:bg-slate-100 transition-all"
                     >
                        취소
                     </button>
                     <button 
                       onClick={finalSubmit}
                       disabled={!isSignAgreed}
                       className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 disabled:bg-slate-200 disabled:shadow-none transition-all"
                     >
                        서명 및 최종 제출
                     </button>
                  </div>
               </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
