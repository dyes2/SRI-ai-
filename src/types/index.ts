export type JobStatus = 'ONGOING' | 'UPCOMING' | 'CLOSED';

export type StageType = 'DOCUMENT' | 'INTERVIEW_1' | 'INTERVIEW_2' | 'INTERVIEW_PT';

export interface RecruitmentField {
  id: string;
  name: string;
  major: string;
  slots: number;
  content: string;
}

export interface AnnouncementSchedule {
  postingPeriod: { start: string; end: string };
  applicationPeriod: { start: string; end: string };
  documentResults: string;
  interview1: string;
  interview2?: string;
  finalResults: string;
}

export interface Job {
  id: string;
  title: string;
  category: '연구직' | '행정직' | '위촉연구원'; 
  type: '정규직' | '계약직' | '무기계약직';
  deadLine: string;
  count: number;
  status: JobStatus;
  description: string;
  
  // 고급 공고 데이터
  fields: RecruitmentField[];
  selectedStages: StageType[];
  qualifications: {
    common: string;
    additional: string;
  };
  requiredDocuments: string[];
  schedule: AnnouncementSchedule;
  salaryInfo: string;
  contractPeriod: string;
  notice: string;
  attachments: { name: string; url: string }[];
}

export type ApplicationStatus = 
  | '미제출' 
  | '접수완료' 
  | '심사중' 
  | '1차전형 합격' 
  | '1차전형 불합격' 
  | '2차전형 합격' 
  | '2차전형 불합격' 
  | '3차전형 합격' 
  | '3차전형 불합격';

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  submittedAt?: string;
  data: {
    personal: {
      name: string;
      birthday: string;
      phone: string;
      email: string;
      address: string;
      password?: string;
    };
    education: Education[];
    experience: Experience[];
    research: Research[];
    intro: {
      motive: string;
      capability: string;
      experience: string;
      suitability: string;
    };
    plan: {
      direction: string;
      utilization: string;
      contribution: string;
    };
    attachments: string[];
  };
}

export interface Education {
  school: string;
  major: string;
  period: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
}

export interface Research {
  title: string;
  journal: string;
  date: string;
}

export interface Inquiry {
  id: string;
  category: '채용일정' | '시스템 오류' | '지원서 작성' | '기타';
  title: string;
  author: string;
  publicName: boolean;
  password?: string;
  content: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

export interface Judge {
  id: string;
  name: string;
  affiliation: string; // 소속
  position: string;    // 직급
  role?: string;       // 역할 (위원, 위원장 등)
}

export interface EvaluationCriteria {
  id: string;
  label: string;
  maxScore: number;
}

export interface EvaluationStage {
  type: StageType;
  title: string;
  multiplier: number; // 합격 배수
  openings: number; // 모집 인원
  judges: Judge[];
  criteria: EvaluationCriteria[];
  minPassScore?: number; // 과락 기준 점수 (평균)
}

export type EvaluationStatus = 'PENDING' | 'SUBMITTED' | 'SIGNED';

export interface ApplicantScore {
  applicantId: string;
  stageType: StageType;
  judgeId: string;
  scores: Record<string, number>; // criteriaId -> score
  isEligible: boolean; // 자격 판단 (Step 1)
  bonusRate: 0 | 5 | 10; // 가산점 %
  comment?: string;
  status: EvaluationStatus;
  signedAt?: string;
  signedBy?: string;
  ipAddress?: string;
}
