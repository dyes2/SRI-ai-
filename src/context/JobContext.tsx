import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Inquiry, ApplicantScore, EvaluationStage } from '../types';

interface JobContextType {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  applicants: any[];
  setApplicants: React.Dispatch<React.SetStateAction<any[]>>;
  applicantScores: ApplicantScore[];
  setApplicantScores: React.Dispatch<React.SetStateAction<ApplicantScore[]>>;
  evaluationStages: Record<string, EvaluationStage[]>;
  setEvaluationStages: React.Dispatch<React.SetStateAction<Record<string, EvaluationStage[]>>>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_JOBS: Job[] = [
  { 
    id: 'JOB-2026-001', 
    title: '2026년 상반기 연구직(정규직) 공개채용', 
    category: '연구직', 
    type: '정규직',
    deadLine: '2026-05-15', 
    count: 3,
    status: 'ONGOING',
    description: '수원시정연구원의 미래를 함께할 인재를 찾습니다.',
    fields: [
      { id: 'f1', name: '도시계획', major: '도시계획학', slots: 2, content: '수원시 도시계획 수립 지원' },
      { id: 'f2', name: '사회복지', major: '사회복지학', slots: 1, content: '지역 복지 서비스 체계화 연구' }
    ],
    selectedStages: ['DOCUMENT', 'INTERVIEW_1', 'INTERVIEW_PT'],
    qualifications: { common: '지방공무원법 제31조의 결격사유가 없는 자', additional: '학위 부합자' },
    requiredDocuments: ['응시원서', '자기소개서'],
    schedule: {
      postingPeriod: { start: '2026-04-01', end: '2026-05-15' },
      applicationPeriod: { start: '2026-04-10', end: '2026-05-15' },
      documentResults: '2026-05-20',
      interview1: '2026-05-25',
      finalResults: '2026-06-05'
    },
    salaryInfo: '원내 규정에 따름',
    contractPeriod: '정규직',
    notice: '본 채용은 블라인드 채용입니다.',
    attachments: []
  }
];

const INITIAL_APPLICANTS = [
  { id: '2026-001-01', name: '홍길동', email: 'hong@test.com', jobId: 'JOB-2026-001', job: '연구직', status: '접수완료', date: '2026-04-20' },
  { id: '2026-001-02', name: '임꺽정', email: 'lim@test.com', jobId: 'JOB-2026-001', job: '연구직', status: '심사중', date: '2026-04-21' },
];

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ATS_JOBS');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
     const saved = localStorage.getItem('ATS_INQUIRIES');
     return saved ? JSON.parse(saved) : [];
  });

  const [applicants, setApplicants] = useState<any[]>(() => {
    const saved = localStorage.getItem('ATS_APPLICANTS');
    return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
  });

  const [applicantScores, setApplicantScores] = useState<ApplicantScore[]>(() => {
    const saved = localStorage.getItem('ATS_SCORES');
    return saved ? JSON.parse(saved) : [];
  });

  const [evaluationStages, setEvaluationStages] = useState<Record<string, EvaluationStage[]>>(() => {
    const saved = localStorage.getItem('ATS_STAGES');
    return saved ? JSON.parse(saved) : {
      'JOB-2026-001': [
        {
          type: 'DOCUMENT',
          title: '1차 서류심사',
          multiplier: 3,
          openings: 3,
          minPassScore: 60,
          judges: [],
          criteria: [{ id: 'c1', label: '적합성', maxScore: 100 }]
        }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('ATS_JOBS', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ATS_INQUIRIES', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('ATS_APPLICANTS', JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem('ATS_SCORES', JSON.stringify(applicantScores));
  }, [applicantScores]);

  useEffect(() => {
    localStorage.setItem('ATS_STAGES', JSON.stringify(evaluationStages));
  }, [evaluationStages]);

  const addJob = (job: Job) => {
    console.log('Adding New Job:', job);
    setJobs(prev => [job, ...prev]);
  };

  const updateJob = (job: Job) => {
    console.log('Updating Job:', job);
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
  };

  const deleteJob = (id: string) => {
    console.log('Deleting Job:', id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <JobContext.Provider value={{ 
      jobs, addJob, updateJob, deleteJob,
      inquiries, setInquiries,
      applicants, setApplicants,
      applicantScores, setApplicantScores,
      evaluationStages, setEvaluationStages
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}
