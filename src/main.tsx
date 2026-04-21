import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import JobDetail from './pages/JobDetail.tsx';
import Apply from './pages/Apply.tsx';
import MyPage from './pages/MyPage.tsx';
import Admin from './pages/Admin.tsx';
import JudgePortal from './pages/JudgePortal.tsx';
import Guide from './pages/Guide.tsx';
import FAQ from './pages/FAQ.tsx';
import Inquiry from './pages/Inquiry.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="apply/:jobId" element={<Apply />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="admin" element={<Admin />} />
          <Route path="guide" element={<Guide />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="inquiry" element={<Inquiry />} />
        </Route>
        <Route path="judge" element={<JudgePortal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
