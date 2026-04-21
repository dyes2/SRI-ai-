import { Link, NavLink } from 'react-router-dom';
import { Building2, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="https://www.suwon.re.kr/img/logo.png" 
                alt="수원시정연구원" 
                className="h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-lg tracking-tight hidden sm:block text-primary">채용</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <NavLink to="/" className={({isActive}) => `text-sm font-bold transition-colors hover:text-primary h-full flex items-center border-b-2 uppercase tracking-tighter ${isActive ? 'text-primary border-primary' : 'text-slate-500 border-transparent'}`}>채용공고</NavLink>
            <NavLink to="/guide" className={({isActive}) => `text-sm font-bold transition-colors hover:text-primary h-full flex items-center border-b-2 uppercase tracking-tighter ${isActive ? 'text-primary border-primary' : 'text-slate-500 border-transparent'}`}>채용안내</NavLink>
            <NavLink to="/faq" className={({isActive}) => `text-sm font-bold transition-colors hover:text-primary h-full flex items-center border-b-2 uppercase tracking-tighter ${isActive ? 'text-primary border-primary' : 'text-slate-500 border-transparent'}`}>공지사항</NavLink>
            <NavLink to="/inquiry" className={({isActive}) => `text-sm font-bold transition-colors hover:text-primary h-full flex items-center border-b-2 uppercase tracking-tighter ${isActive ? 'text-primary border-primary' : 'text-slate-500 border-transparent'}`}>1:1 문의</NavLink>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/mypage" className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-md hover:bg-secondary transition-all shadow-sm active:scale-95">
              마이페이지
            </Link>
            <Link to="/admin" className="p-2 text-slate-400 hover:text-primary transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 pb-4 px-4 shadow-xl">
          <div className="flex flex-col gap-4 pt-4">
            <NavLink to="/" className="text-sm font-bold py-2 uppercase tracking-wide">채용공고</NavLink>
            <NavLink to="/guide" className="text-sm font-bold py-2 uppercase tracking-wide">채용안내</NavLink>
            <NavLink to="/faq" className="text-sm font-bold py-2 uppercase tracking-wide">공지사항</NavLink>
            <hr className="border-slate-100" />
            <Link to="/mypage" className="flex items-center gap-2 py-2 text-sm font-bold text-primary">
              <User className="w-4 h-4" /> 마이페이지
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
