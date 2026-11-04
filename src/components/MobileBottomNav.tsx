import React from 'react';
import { useApp, TabType } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Home,
  Building2,
  Stethoscope,
  CalendarCheck,
  AlertTriangle,
  Search
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();
  const t = TRANSLATIONS[language];

  const items: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'hospitals', label: t.navHospitals.split(' ')[0], icon: Building2 },
    { id: 'doctors', label: t.navDoctors.split(' ')[0], icon: Stethoscope },
    { id: 'appointment', label: language === 'kn' ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್' : 'ORS', icon: CalendarCheck },
    { id: 'report', label: language === 'kn' ? 'ದೂರು' : 'Report', icon: AlertTriangle },
    { id: 'track', label: language === 'kn' ? 'ಪರಿಶೀಲನೆ' : 'Track', icon: Search },
  ];

  return (
    <nav className="no-print xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(15,41,66,0.06)] pb-safe">
      <div className="flex items-center justify-around px-1 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isReport = item.id === 'report';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 min-w-[52px] min-h-[48px] transition-colors ${
                isActive
                  ? 'text-[#0F2942] font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#0F2942]" />
              )}

              <Icon className={`w-5 h-5 ${isReport && !isActive ? 'text-amber-600' : ''}`} />

              <span className="text-[10px] tracking-tight mt-1 leading-none font-medium truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
