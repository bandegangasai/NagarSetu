import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { ComplaintDetailPage } from './pages/ComplaintDetailPage';
import { PublicMapPage } from './pages/PublicMapPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="submit" element={<SubmitComplaintPage />} />
        <Route path="track" element={<TrackComplaintPage />} />
        <Route path="track/:id" element={<TrackComplaintPage />} />
        <Route path="complaint/:id" element={<ComplaintDetailPage />} />
        <Route path="map" element={<PublicMapPage />} />
        <Route path="transparency" element={<TransparencyPage />} />
        <Route path="about" element={<AboutPage />} />
        
        {/* Role Dashboards */}
        <Route path="citizen" element={<CitizenDashboardPage />} />
        <Route path="officer" element={<OfficerDashboardPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />

        {/* Informational Pages */}
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
