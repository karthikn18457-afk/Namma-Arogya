/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { HospitalModal } from './components/HospitalModal';
import { TRANSLATIONS } from './utils/translations';

import { HomeView } from './views/HomeView';
import { HospitalFinderView } from './views/HospitalFinderView';
import { DoctorDirectoryView } from './views/DoctorDirectoryView';
import { AppointmentBookingView } from './views/AppointmentBookingView';
import { ReportProblemView } from './views/ReportProblemView';
import { TrackComplaintView } from './views/TrackComplaintView';
import { HospitalFacilitiesView } from './views/HospitalFacilitiesView';
import { GovernmentDashboardView } from './views/GovernmentDashboardView';
import { GovernmentCommunicationCentreView } from './views/GovernmentCommunicationCentreView';
import { CentralDataManagementView } from './views/CentralDataManagementView';
import { AboutProjectView } from './views/AboutProjectView';

import { Building2, ExternalLink, ShieldCheck, Heart, PhoneCall, Info } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#0F2942]/15 antialiased">
      {/* Top Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 pt-6 pb-24 lg:pb-16 max-w-7xl">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'hospitals' && <HospitalFinderView />}
        {activeTab === 'doctors' && <DoctorDirectoryView />}
        {activeTab === 'appointment' && <AppointmentBookingView />}
        {activeTab === 'report' && <ReportProblemView />}
        {activeTab === 'track' && <TrackComplaintView />}
        {activeTab === 'facilities' && <HospitalFacilitiesView />}
        {activeTab === 'dashboard' && <GovernmentDashboardView />}
        {activeTab === 'gov-comm' && <GovernmentCommunicationCentreView />}
        {activeTab === 'data-mgmt' && <CentralDataManagementView />}
        {activeTab === 'about' && <AboutProjectView />}
      </main>

      {/* Hospital Detail Modal (Global Overlay) */}
      <HospitalModal />

      {/* Interactive Draggable Floating Action Button that moves around */}
      <FloatingActionButton />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Institutional Footer */}
      <footer className="no-print bg-[#0A1E31] text-slate-300 border-t border-[#1E3A8A]/30 text-xs py-14 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Brand & Charter */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-[#0F2942] border border-[#1E3A8A] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
                  NA
                </div>
                <div>
                  <span className="font-serif text-white font-bold text-base tracking-tight block">
                    NAMMA AROGYA
                  </span>
                  <span className="text-[11px] font-sans text-amber-300 block tracking-tight font-medium">
                    ನಮ್ಮ ಆರೋಗ್ಯ · Karnataka Public Healthcare
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                {language === 'kn'
                  ? 'ಕರ್ನಾಟಕದ ನಾಗರಿಕರಿಗಾಗಿ ಸಾರ್ವಜನಿಕ ಆಸ್ಪತ್ರೆಗಳ ವಿವರಗಳು, ವೈದ್ಯರ ಮಾಹಿತಿ, ಅಧಿಕೃತ ORS ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮತ್ತು ಜನಸ್ಪಂದನ ದೂರು ಮಾರ್ಗದರ್ಶನದ ಪಾರದರ್ಶಕ ನಾಗರಿಕ ವೇದಿಕೆ.'
                  : 'An independent public healthcare information and grievance support platform connecting citizens with Karnataka government hospitals, verified doctor OPD rosters, official ORS bookings, and statutory complaint assistance.'}
              </p>
              <div className="p-2.5 rounded bg-[#0F2942]/60 border border-[#1E3A8A]/50 text-[11px] text-amber-200">
                <div className="font-semibold text-white mb-0.5 flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>Independent Student Project</span>
                </div>
                <p className="text-slate-300 text-[10px] leading-snug">
                  Namma Arogya is an independent student-developed academic initiative and is not an official Karnataka Government website.
                </p>
              </div>
            </div>

            {/* Col 2: Citizen Services */}
            <div>
              <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4 border-b border-slate-700/80 pb-2">
                {language === 'kn' ? 'ನಾಗರಿಕ ಸೇವೆಗಳು' : 'Citizen Healthcare Services'}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <button onClick={() => setActiveTab('hospitals')} className="hover:text-white transition-colors text-left">
                    {t.navHospitals}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('doctors')} className="hover:text-white transition-colors text-left">
                    {t.navDoctors} (KMC Verified)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('appointment')} className="hover:text-white transition-colors text-left">
                    {t.navAppointments} (Official ORS Portal)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('report')} className="hover:text-white transition-colors text-left">
                    {t.navReport} (Citizen Grievance)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('track')} className="hover:text-white transition-colors text-left">
                    {t.navTrack} (Reference Search)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: State Health Governance */}
            <div>
              <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4 border-b border-slate-700/80 pb-2">
                {language === 'kn' ? 'ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು & ಸಂಪರ್ಕ' : 'Official Government Portals'}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <a href="https://ipgrs.karnataka.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span>Karnataka Janaspandana (IPGRS)</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </li>
                <li>
                  <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span>CPGRAMS Portal (Govt. of India)</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </li>
                <li>
                  <a href="https://karunadu.karnataka.gov.in/hfw/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span>Karnataka HFW Department</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </li>
                <li>
                  <a href="https://ors.gov.in/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span>National ORS Booking Portal</span>
                    <ExternalLink className="w-3 h-3 text-amber-300" />
                  </a>
                </li>
                <li>
                  <button onClick={() => setActiveTab('gov-comm')} className="hover:text-white transition-colors text-left">
                    {t.navGovComm} &amp; DHO Roster
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: State Emergency Helplines */}
            <div className="space-y-3.5">
              <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4 border-b border-slate-700/80 pb-2">
                {language === 'kn' ? 'ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು' : 'Karnataka Emergency Helplines'}
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#0F2942]/80 border border-[#1E3A8A]/50 flex items-center justify-between">
                  <span className="text-slate-300">Arogya Kavacha Ambulance:</span>
                  <a href="tel:108" className="font-mono font-bold text-white hover:text-amber-300 tabular-nums">108</a>
                </div>
                <div className="p-2.5 rounded bg-[#0F2942]/80 border border-[#1E3A8A]/50 flex items-center justify-between">
                  <span className="text-slate-300">Health Advice &amp; Info:</span>
                  <a href="tel:104" className="font-mono font-bold text-white hover:text-amber-300 tabular-nums">104</a>
                </div>
                <div className="p-2.5 rounded bg-[#0F2942]/80 border border-[#1E3A8A]/50 flex items-center justify-between">
                  <span className="text-slate-300">Maternal &amp; Child Health:</span>
                  <a href="tel:102" className="font-mono font-bold text-white hover:text-amber-300 tabular-nums">102</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Academic Provenance Strip */}
          <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <div>
              © 2026 NAMMA AROGYA. Independent Public Healthcare &amp; Citizen Grievance Support Platform.
            </div>
            <div className="flex items-center gap-3">
              <span>Public Healthcare. Citizen Voice. Better Accountability.</span>
              <span>·</span>
              <button onClick={() => setActiveTab('about')} className="hover:text-white underline underline-offset-2">
                Project Transparency &amp; Disclosure
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
