import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Building2,
  Stethoscope,
  CalendarCheck,
  AlertTriangle,
  Search,
  Activity,
  Send,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Info
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, userRole, setUserRole, complaints, resetDemoData, language, setLanguage } = useApp();
  const t = TRANSLATIONS[language];

  const pendingComplaintsCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  ).length;

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Activity },
    { id: 'hospitals', label: t.navHospitals, icon: Building2 },
    { id: 'doctors', label: t.navDoctors, icon: Stethoscope },
    { id: 'appointment', label: t.navAppointments, icon: CalendarCheck },
    { id: 'report', label: t.navReport, icon: AlertTriangle },
    { id: 'track', label: t.navTrack, icon: Search },
    { id: 'facilities', label: t.navFacilities, icon: Activity },
    { id: 'gov-comm', label: t.navGovComm, icon: Send },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      {/* Top Academic & Civic Utility Ribbon */}
      <div className="bg-[#0A1E31] text-[#CBD5E1] px-4 sm:px-6 py-1.5 text-xs border-b border-[#1E3A8A]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
            <span className="font-semibold text-white tracking-tight">
              {language === 'kn' ? 'ನಮ್ಮ ಆರೋಗ್ಯ · ನಾಗರಿಕ ಆರೋಗ್ಯ ವೇದಿಕೆ' : 'NAMMA AROGYA · PUBLIC HEALTHCARE PLATFORM'}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-xs text-amber-300 font-medium">
              {language === 'kn'
                ? 'ಸ್ವತಂತ್ರ ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆ · ಸರ್ಕಾರಿ ಸ್ವಾಮ್ಯವಲ್ಲ'
                : 'Independent Student Project · Not a Government Agency'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="hidden sm:flex items-center gap-3 text-slate-300">
              <span>{language === 'kn' ? 'ಆರೋಗ್ಯ ಕವಚ ತುರ್ತು:' : 'Arogya Kavacha:'}</span>
              <a href="tel:108" className="font-mono font-bold text-white hover:text-amber-300 tabular-nums">108</a>
              <span className="text-slate-600">|</span>
              <span>{language === 'kn' ? 'ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ:' : 'Health Helpline:'}</span>
              <a href="tel:104" className="font-mono font-bold text-white hover:text-amber-300 tabular-nums">104</a>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-[#1E293B] rounded p-0.5 border border-slate-700">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                  language === 'en'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors font-sans ${
                  language === 'kn'
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Reset Demo button */}
            <button
              onClick={resetDemoData}
              title="Reset demonstration records"
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">{language === 'kn' ? 'ರೀಸೆಟ್' : 'Reset Demo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Masthead Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* Brand Wordmark Zone (Selector 6) */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-sm bg-[#0F2942] border border-[#1E3A8A]/40 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0F2942]">
                  NAMMA AROGYA
                </span>
                <span className="hidden sm:inline font-sans text-xs font-semibold px-1.5 py-0.5 bg-slate-100 text-[#0F2942] rounded border border-slate-200">
                  ನಮ್ಮ ಆರೋಗ್ಯ
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans tracking-tight mt-0.5">
                <span className="font-medium text-[#0F2942]">Karnataka Healthcare</span>
                <span className="text-slate-300">·</span>
                <span className="font-sans text-[11px] text-slate-600">
                  {language === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ & ದೂರು ನಿರ್ವಹಣೆ' : 'Citizen Grievance Support'}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium tracking-tight rounded transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#0F2942] font-semibold border-b-2 border-[#0F2942] bg-slate-50'
                      : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Admin Toggle & Moving Icon CTA (Selector 5) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Citizen / Admin switch */}
            <div className="hidden sm:flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
              <button
                onClick={() => {
                  setUserRole('citizen');
                  if (activeTab === 'dashboard') setActiveTab('home');
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-colors ${
                  userRole === 'citizen'
                    ? 'bg-white text-[#0F2942] font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3 h-3 text-[#0F2942]" />
                <span>{language === 'kn' ? 'ನಾಗರಿಕ' : 'Citizen'}</span>
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  setActiveTab('dashboard');
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-colors ${
                  userRole === 'admin'
                    ? 'bg-[#0F2942] text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>{language === 'kn' ? 'ಆಡಳಿತ' : 'Admin'}</span>
                {pendingComplaintsCount > 0 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[9px] font-bold flex items-center justify-center font-mono">
                    {pendingComplaintsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Moving Action Icon Button (Selector 5) */}
            <button
              onClick={() => setActiveTab('report')}
              title={language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಸಮಸ್ಯೆ ಅಥವಾ ದೂರು ಸಲ್ಲಿಸಿ' : 'Report Hospital Issue / Grievance'}
              className="min-h-[42px] px-3.5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs rounded shadow-xs flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-[#0F2942]"
            >
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/10 animate-gentle-float">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
              <span className="whitespace-nowrap font-medium tracking-tight">
                {language === 'kn' ? 'ದೂರು ಸಲ್ಲಿಸಿ' : 'Report an Issue'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
