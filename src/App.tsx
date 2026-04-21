/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">공정하고 투명한 미래를 설계합니다.</h1>
          <p className="text-slate-500 max-w-2xl mb-8">수원시정연구원은 블라인드 채용을 통해 직무 역량 중심의 인재를 발굴합니다. 전문성과 열정을 갖춘 여러분의 지원을 기다립니다.</p>
          <Outlet />
        </div>
      </main>
      <footer className="h-12 bg-slate-900 text-slate-500 flex items-center justify-between px-8 text-[10px] shrink-0 uppercase tracking-wider">
        <div>© 2024 SUWON RESEARCH INSTITUTE. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="https://www.suwon.re.kr/c/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">개인정보처리방침</a>
          <a href="https://www.suwon.re.kr/c/noemail" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">이메일무단수집거부</a>
          <a href="https://www.suwon.re.kr/c/location" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">찾아오시는 길</a>
        </div>
      </footer>
    </div>
  );
}
