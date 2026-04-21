import { motion } from 'motion/react';
import { 
  Info, 
  CheckCircle2, 
  Scale, 
  FileWarning, 
  MapPin, 
  Clock, 
  Wallet, 
  UserCheck, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

export default function Guide() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">채용 안내</h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
          수원시정연구원은 능력 중심의 공정한 채용 문화를 지향합니다.<br/>
          지원 전 아래의 근무 조건 및 유의사항을 반드시 확인해 주시기 바랍니다.
        </p>
      </section>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Working Conditions (Bento Medium) */}
        <div className="md:col-span-12 lg:col-span-6 bento-card">
          <div className="bento-card-header">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">근무 조건</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 근무지
                </p>
                <p className="text-sm font-bold text-slate-700">수원시정연구원</p>
                <p className="text-[11px] text-slate-500">경기도 수원시 권선구 수인로 126</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 근무 시간
                </p>
                <p className="text-sm font-bold text-slate-700">주 40시간 (월~금)</p>
                <p className="text-[11px] text-slate-500">09:00 ~ 18:00 (휴게 1시간)</p>
              </div>
              <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> 보수 및 복리후생
                </p>
                <p className="text-sm font-bold text-slate-700">연구원 관련 규정에 따름</p>
                <p className="text-[11px] text-slate-500">직종 및 직급별 상이 (공고문 별첨 참조)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Qualifications (Bento Medium) */}
        <div className="md:col-span-12 lg:col-span-6 bento-card">
          <div className="bento-card-header">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">응시 자격</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs italic">01</div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">공통 신청 자격</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    연구원 인사관리 규정 제20조(결격사유)에 해당하지 않는 자<br/>
                    (국가/지방공무원법 제33조/제31조 준용 등)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs italic">02</div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">거주지 및 성별</p>
                  <p className="text-xs text-slate-500 leading-relaxed">제한 없음 (단, 남자의 경우 병역필 또는 면제자)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs italic">03</div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">연령 제한</p>
                  <p className="text-xs text-slate-500 leading-relaxed">만 18세 이상 ~ 만 60세 미만 (정년 규정 준수)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Points Table (Bento Large) */}
        <div className="md:col-span-12 bento-card">
          <div className="bento-card-header">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">가산점 및 합산 방법</h2>
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">필기시험 전일까지 증빙 필수</span>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">구분</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">가산비율</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">가산 내용 및 증빙</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic font-medium">
                <tr>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">취업지원대상자</td>
                  <td className="px-6 py-5 text-sm font-bold text-secondary">5 ~ 10%</td>
                  <td className="px-6 py-5 text-xs text-slate-500">보훈(지)청 발행 취업지원대상자 증명서 제출 시 적용</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">장애인</td>
                  <td className="px-6 py-5 text-sm font-bold text-secondary">5%</td>
                  <td className="px-6 py-5 text-xs text-slate-500">지자체 발행 장애인 증명서 제출 시 적용</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 text-xs text-slate-400 font-medium list-disc list-inside">
              <p>• 가점요인이 2개 이상인 경우 가무가 높은 1개만 적용</p>
              <p>• 선발예정인원 3인 이하 시 가점은 합격순위에만 영향</p>
              <p>• 취업지원대상자 가점 합격 인원은 채용정원의 30% 이내 제한</p>
              <p>• 모든 가점은 증빙서류 미제출 시 대상에서 제외됨</p>
            </div>
          </div>
        </div>

        {/* Application Notices (Bento Small) */}
        <div className="md:col-span-12 lg:col-span-4 bento-card bg-slate-50/80 border-slate-200">
          <div className="bento-card-header border-slate-100">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">접수 시 유의사항</h2>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  기관별 <span className="text-primary font-bold">중복지원이 불가</span>하며, 자격 요건 확인 후 최종 제출 바랍니다.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  응시원서 내 가족관계, 출신지, 학교명 등 인적사항 기재 시 <span className="text-primary font-bold">불이익</span>을 받을 수 있습니다.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  사진파일은 <span className="text-primary font-bold">6개월 이내 촬영</span>한 규격(3.5x4.5cm)의 정면 상반신 사진만 인정됩니다. (해당자만)
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Applicant Reminders (Bento Medium) */}
        <div className="md:col-span-12 lg:col-span-8 bento-card">
          <div className="bento-card-header">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-slate-800">응시자 필독 유의사항</h2>
            </div>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <p className="text-xs font-extrabold text-amber-800 flex items-center gap-1 leading-none mb-1">
                <ShieldAlert className="w-3 h-3" /> 블라인드 채용 가이드
              </p>
              <p className="text-[11px] text-amber-700/80 leading-relaxed font-medium capitalize">
                채용 전 과정에서 가족관계, 출신지, 학력 등 차별을 야기할 수 있는 일체의 정보를 요구하지 않으며, 해당 내용을 암시할 수 있는 일체의 기재를 금지합니다.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800 leading-none mb-1">합격 취소 관련</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                응시원서 내용이 사실과 다르거나, 결격사유 발견 시 또는 부정 합격 확인 시 최종 합격 결정 이후에도 합격이 취소될 수 있습니다.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800 leading-none mb-1">점수 공개 정책</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                채용 과정의 투명성 제고를 위해 지원자 본인의 필기시험 점수를 공개합니다.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs font-bold text-slate-800 leading-none mb-1">일정 안내</p>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                개별 통지는 하지 않으며, 채용 홈페이지 및 연구원 홈페이지를 수시로 확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Document Return Policy (Bento Small) */}
        <div className="md:col-span-12 bento-card bg-accent/50 border-accent/20">
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800">채용 서류 반환 안내</h3>
                <p className="text-xs text-slate-500 font-medium italic">채용 여부 확정 후 14일부터 30일까지 반환 청구 가능 (이메일 제출 건 제외)</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-secondary transition-all shadow-md">
              반환 청구 가이드 다운로드
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
