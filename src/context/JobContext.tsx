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
  { 
    id: '2026-001-01', 
    name: '홍길동', 
    email: 'hong@test.com', 
    jobId: 'JOB-2026-001', 
    job: '연구직', 
    status: '접수완료', 
    date: '2026-04-20',
    isNew: true,
    data: {
      personal: { name: '홍길동', birthday: '1995-01-01', phone: '010-1234-5678', email: 'hong@test.com', address: '서울특별시 강남구' },
      intro: {
        motive: '수원시의 발전을 위해 그동안 쌓아온 정책 연구 능력을 발휘하고 싶습니다. 특히 도시 계획 분야에서의 실무 경험을 바탕으로 현실적인 대안을 제시하겠습니다.',
        capability: '빅데이터 분석을 통한 도시 트렌드 예측 및 정책 제언 능력이 뛰어납니다. 다수의 지자체 프로젝트를 수행하며 협업 능력을 검증받았습니다.',
        experience: 'A연구소에서 3년간 도시 재생 프로젝트 선임 연구원으로 근무하며, 노후 도심 활성화 방안을 수립했습니다.',
        suitability: '수원시정연구원이 추구하는 시민 중심의 연구 기조와 저의 연구 철학이 일치한다고 확신합니다.'
      },
      plan: {
        direction: '시민 체감형 스마트시티 정책 연구에 집중하겠습니다.',
        utilization: '보유한 데이터 분석 툴(Python, R)을 활용하여 정교한 결과물을 도출하겠습니다.',
        contribution: '수원시가 글로벌 선도 도시로 도약하는 데 필요한 실질적인 정책들을 지속적으로 발굴하겠습니다.'
      },
      attachments: ['resume.pdf', 'portfolio.pdf']
    }
  },
  { 
    id: '2026-001-02', 
    name: '임꺽정', 
    email: 'lim@test.com', 
    jobId: 'JOB-2026-001', 
    job: '연구직', 
    status: '심사중', 
    date: '2026-04-21',
    isNew: false,
    data: {
      personal: { name: '임꺽정', birthday: '1990-05-20', phone: '010-9876-5432', email: 'lim@test.com', address: '경기도 수원시 영통구' },
      intro: {
        motive: '사회복지 시스템의 사각지대를 해소하기 위한 연구에 매진하고 싶습니다.',
        capability: '양적 연구와 질적 기초 조사를 병행할 수 있는 역량을 갖추고 있으며, 현장 방문 중심의 연구를 선호합니다.',
        experience: '복지재단에서 5년간 사회복지사로 근무하며 현장의 목소리를 데이터화하는 작업을 수행했습니다.',
        suitability: '실무 경험과 이론적 배경을 모두 갖춘 준비된 인재입니다.'
      },
      plan: {
        direction: '1인 가구 고독사 방지를 위한 지역 공동체 회복 모델 연구',
        utilization: '기존의 복지 네트워크를 데이터로 시각화하여 취약 지역을 식별하는 데 사용하겠습니다.',
        contribution: '따뜻한 공동체 수원을 만드는 데 정책적 기반을 제공하겠습니다.'
      },
      attachments: ['profile.jpg']
    }
  },
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
    
    // Initialize default evaluation stages
    const defaultStages: EvaluationStage[] = job.selectedStages.map(st => ({
      type: st,
      title: st === 'DOCUMENT' ? '서류심사' : 
             st === 'INTERVIEW_1' ? '1차 면접' : 
             st === 'INTERVIEW_2' ? '2차 면접' : '실무/PT 면접',
      multiplier: 3,
      openings: job.count,
      minPassScore: 60,
      judges: [],
      criteria: [
        { id: `c-${st}-1`, label: '전문성', maxScore: 40 },
        { id: `c-${st}-2`, label: '인성/태도', maxScore: 30 },
        { id: `c-${st}-3`, label: '발전가능성', maxScore: 30 }
      ]
    }));
    
    setEvaluationStages(prev => ({ ...prev, [job.id]: defaultStages }));
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
