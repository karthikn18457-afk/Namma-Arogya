import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../utils/translations';
import {
  Building2,
  Stethoscope,
  CalendarCheck,
  AlertTriangle,
  Search,
  Bed,
  PhoneCall,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveTab,
    hospitals,
    complaints,
    notices,
    setSelectedHospitalDetail,
    language
  } = useApp();

  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>('All');

  const karnatakaDistricts = [
    'All',
    'Bengaluru Urban',
    'Mysuru',
    'Hassan',
    'Dakshina Kannada',
    'Dharwad',
    'Shivamogga'
  ];

  const facilityTypes = [
    'All',
    'District Hospital',
    'Govt Medical College Hospital',
    'General Hospital',
    'Primary Health Centre (PHC)',
    'Taluk Hospital'
  ];

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      !searchQuery.trim() ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict =
      selectedDistrict === 'All' || h.district.includes(selectedDistrict);

    const matchesType =
      selectedFacilityType === 'All' || h.type === selectedFacilityType;

    return matchesSearch && matchesDistrict && matchesType;
  });

  const totalBeds = hospitals.reduce(
    (acc, h) => acc + h.bedStats.icu.total + h.bedStats.oxygen.total + h.bedStats.general.total + h.bedStats.pediatric.total,
    0
  );
  const occupiedBeds = hospitals.reduce(
    (acc, h) => acc + h.bedStats.icu.occupied + h.bedStats.oxygen.occupied + h.bedStats.general.occupied + h.bedStats.pediatric.occupied,
    0
  );
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="border-b border-slate-200 pb-12 pt-2">
        {/* Masthead Kicker with Academic Disclaimer */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-mono border-b border-slate-200 pb-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0F2942]" aria-hidden="true" />
            <span className="text-[#0F2942] font-semibold uppercase tracking-wider">
              {language === 'kn' ? 'ನಮ್ಮ ಆರೋಗ್ಯ · ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಪರಿಶೀಲನಾ ವೇದಿಕೆ' : 'NAMMA AROGYA · KARNATAKA HEALTH MONITORING'}
            </span>
            <span className="text-slate-400">·</span>
            <span className="hidden sm:inline text-slate-500">Citizen Healthcare & Hospital Directory</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-medium">
              {language === 'kn' ? 'ಸ್ವತಂತ್ರ ವಿದ್ಯಾರ್ಥಿ ಪ್ರಾಜೆಕ್ಟ್' : 'Independent Student Project'}
            </span>
          </div>
        </div>

        {/* 2-Column Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Headline, Search & Public Context */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-slate-100 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Public Healthcare. Citizen Voice. Better Accountability.</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
                {language === 'kn'
                  ? 'ಕರ್ನಾಟಕದ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು & ನಾಗರಿಕ ಆರೋಗ್ಯ ಸೇವೆಗಳ ನೈಜ ಮಾಹಿತಿ.'
                  : 'Empowering Citizens with Verifiable Public Healthcare in Karnataka.'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {language === 'kn'
                  ? 'ನಮ್ಮ ಆರೋಗ್ಯ (Namma Arogya) ವೇದಿಕೆಯು ಕರ್ನಾಟಕದ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳು, ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು (PHC), ತಜ್ಞ ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಅಧಿಕೃತ ORS ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಲಿಂಕ್‌ಗಳನ್ನು ನಾಗರಿಕರಿಗೆ ಸುಲಭವಾಗಿ ಒದಗಿಸುತ್ತದೆ.'
                  : 'An independent public healthcare portal helping citizens discover government hospitals, check verified doctor OPD schedules, access official ORS appointment portals, and report hospital maintenance issues.'}
              </p>
            </div>

            {/* Integrated Hospital Search Bar */}
            <div className="space-y-3 pt-2">
              <div className="bg-white p-2 rounded border border-slate-300 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center flex-1 px-2.5 py-1.5 gap-2">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={
                      language === 'kn'
                        ? 'ಆಸ್ಪತ್ರೆ, ಜಿಲ್ಲೆ ಅಥವಾ ವಿಭಾಗ ಹುಡುಕಿ (ಉದಾ: ವಿಕ್ಟೋರಿಯಾ, ಹಾಸನ, ಮೈಸೂರು)...'
                        : 'Search by hospital name, district, or department (e.g. Victoria, Hassan, Mysuru)...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveTab('hospitals');
                    }}
                    className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden bg-transparent font-medium"
                  />
                </div>

                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="min-h-[44px] px-6 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded transition-colors shrink-0 flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ' : 'Find Hospital'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick District Filter Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <span className="text-[11px] font-medium mr-1 text-slate-900">
                  {language === 'kn' ? 'ಜಿಲ್ಲೆಗಳು:' : 'Districts:'}
                </span>
                {karnatakaDistricts.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDistrict(d);
                      if (d !== 'All') setActiveTab('hospitals');
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors ${
                      selectedDistrict === d
                        ? 'bg-[#0F2942] text-white border-[#0F2942]'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-[#0F2942] hover:text-[#0F2942]'
                    }`}
                  >
                    {d === 'All' ? (language === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು' : 'All Districts') : d}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Transparency & Provenance Notice */}
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong className="text-slate-900 font-semibold">Project Transparency & Disclaimer:</strong>{' '}
                {language === 'kn'
                  ? 'ನಮ್ಮ ಆರೋಗ್ಯವು ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಜಾಗೃತಿ ಉದ್ದೇಶದ ಸ್ವತಂತ್ರ ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಯಾಗಿದೆ. ಇದು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಸಂಸ್ಥೆಯಲ್ಲ. ಆನ್‌ಲೈನ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಅಧಿಕೃತ ರಾಷ್ಟ್ರೀಯ ORS (ors.gov.in) ಮೂಲಕವೇ ನಡೆಯುತ್ತವೆ.'
                  : 'Namma Arogya is an independent student-developed project and is not an official government service. No government affiliation or automatic background dispatch is claimed. Hospital OPD bookings are directed to official ORS (ors.gov.in).'}
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Photography & Hospital Exterior (Selector 1) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="relative border border-slate-200 bg-white p-2 rounded shadow-xs">
              <div className="overflow-hidden aspect-[16/10] bg-slate-100 rounded-sm">
                <img
                  src="/src/assets/images/karnataka_civil_hospital_exterior_1793731308022.jpg"
                  alt="Hassan District Civil Hospital Main Campus Karnataka"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                />
              </div>

              {/* Documentary Caption */}
              <div className="pt-2.5 px-1 text-[11px] text-slate-600 leading-snug flex items-start justify-between gap-2 border-t border-slate-100 mt-2">
                <div>
                  <span className="font-semibold text-slate-900">District Civil Hospital —</span>
                  <span className="ml-1 text-slate-600">Outpatient reception, trauma wing, and 108 Arogya Kavacha bay, Karnataka.</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 font-medium">
                  Verified Facility
                </span>
              </div>
            </div>

            {/* Quick Live Telemetry Strip */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-mono text-slate-500">Monitored Beds</div>
                <div className="font-mono font-bold text-lg text-slate-900 mt-0.5 tabular-nums">
                  {totalBeds.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-medium">{availableBeds} Vacant Today</div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-mono text-slate-500">108 Ambulances</div>
                <div className="font-mono font-bold text-lg text-slate-900 mt-0.5 tabular-nums">
                  {hospitals.reduce((acc, h) => acc + h.ambulanceCount.ready, 0)} Ready
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">Arogya Kavacha</div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-200">
                <div className="text-[10px] uppercase font-mono text-slate-500">Citizen Issues</div>
                <div className="font-mono font-bold text-lg text-[#0F2942] mt-0.5 tabular-nums">
                  {complaints.length} Logged
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">Demonstration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY CITIZEN PATHWAYS (Natural Horizontal Content Layout) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[#0F2942] tracking-wider font-semibold">
              {language === 'kn' ? 'ನಾಗರಿಕ ಸೇವೆಗಳು' : 'Core Public Healthcare Portals'}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {language === 'kn' ? 'ನಾಗರಿಕರಿಗಾಗಿ ಪ್ರಮುಖ ಸೇವೆಗಳು' : 'Essential Public Services for Karnataka'}
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md text-right sm:text-left">
            Access government hospital directories, verified doctor schedules, official ORS bookings, and citizen grievance escalation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 01. Hospitals Directory */}
          <div
            onClick={() => setActiveTab('hospitals')}
            className="group cursor-pointer bg-white p-6 rounded border border-slate-200 hover:border-[#0F2942] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-[#0F2942]">01</span>
                <span>District & Taluk</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#0F2942] transition-colors">
                {language === 'kn' ? 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳ ಪಟ್ಟಿ' : 'Government Hospitals'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Directory of Victoria Hospital, MMC & KR Hospital Mysuru, Hassan District Civil Hospital, Wenlock Mangaluru, and Taluk PHCs.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F2942]">
              <span>{language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ವೀಕ್ಷಿಸಿ' : 'Browse Directory'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 02. Verified Doctor Directory */}
          <div
            onClick={() => setActiveTab('doctors')}
            className="group cursor-pointer bg-white p-6 rounded border border-slate-200 hover:border-[#0F2942] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-[#0F2942]">02</span>
                <span>KMC Verified</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#0F2942] transition-colors">
                {language === 'kn' ? 'ವೈದ್ಯರ ಮಾಹಿತಿ & ಒಪಿಡಿ' : 'Specialist Doctors & OPD'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Karnataka Medical Council registered physicians, professors, and surgeons with OPD consultation hours and room numbers.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F2942]">
              <span>{language === 'kn' ? 'ವೈದ್ಯರ ವೇಳಾಪಟ್ಟಿ' : 'View Specialist Roster'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 03. Official Appointments */}
          <div
            onClick={() => setActiveTab('appointment')}
            className="group cursor-pointer bg-white p-6 rounded border border-slate-200 hover:border-[#0F2942] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-[#0F2942]">03</span>
                <span>National ORS Gateway</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#0F2942] transition-colors">
                {language === 'kn' ? 'ಅಧಿಕೃತ ಒಪಿಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್' : 'Official ORS Bookings'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Direct guidance to the NIC Online Registration System (ors.gov.in) with hospital codes, OPD time slots, and walk-in counter checklist.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F2942]">
              <span>{language === 'kn' ? 'ನೋಂದಣಿ ಮಾರ್ಗಸೂಚಿ' : 'Book via ORS'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 04. Report a Problem */}
          <div
            onClick={() => setActiveTab('report')}
            className="group cursor-pointer bg-white p-6 rounded border border-slate-200 hover:border-[#0F2942] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-[#0F2942]">04</span>
                <span>Citizen Grievance</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-[#0F2942] transition-colors">
                {language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' : 'Report Hospital Issue'}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Log grievances regarding medicine shortages, doctor absence, or sanitation with photos. Generate official complaint dossier for Janaspandana.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F2942]">
              <span>{language === 'kn' ? 'ದೂರು ದಾಖಲಿಸಿ' : 'Lodge Citizen Issue'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED KARNATAKA HOSPITALS PREVIEW (Selector 2, 3) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[#0F2942] tracking-wider font-semibold">
              {language === 'kn' ? 'ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು' : 'Institutional Directory'}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {language === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು' : 'Featured Government Hospitals of Karnataka'}
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('hospitals')}
            className="text-xs font-semibold text-[#0F2942] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{language === 'kn' ? 'ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Complete Directory'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Listing Rows (Selector 2 & 3) */}
        <div className="space-y-4">
          {filteredHospitals.slice(0, 3).map((h) => {
            const icuAvail = h.bedStats.icu.total - h.bedStats.icu.occupied;
            const oxyAvail = h.bedStats.oxygen.total - h.bedStats.oxygen.occupied;
            const genAvail = h.bedStats.general.total - h.bedStats.general.occupied;

            return (
              <div
                key={h.id}
                onClick={() => setSelectedHospitalDetail(h)}
                className="group cursor-pointer bg-white p-5 sm:p-6 rounded border border-slate-200 hover:border-[#0F2942] hover:shadow-xs transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Core Data (Selector 3) */}
                <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 max-w-3xl">
                  <div className="w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded bg-slate-100 border border-slate-200">
                    <img
                      src={h.imageUrl}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider flex items-center gap-2">
                      <span className="font-semibold text-[#0F2942]">{h.district}</span>
                      <span>·</span>
                      <span className="text-slate-500">{h.type}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0F2942] transition-colors leading-snug">
                      {h.name}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1">{h.address}</p>

                    <div className="text-xs text-slate-600 pt-1 flex flex-wrap items-center gap-3">
                      <span>Emergency Helpline: <strong className="text-slate-900 font-mono">{h.emergencyHelpline}</strong></span>
                      <span>·</span>
                      <span>Nodal Officer: <strong className="text-slate-900">{h.nodalOfficer.split(',')[0]}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Tabular Capacity & Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                  <div className="flex items-center gap-4 text-xs text-right">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-500">ICU Beds</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {icuAvail} <span className="text-slate-400 font-normal">/ {h.bedStats.icu.total}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-500">Oxygen</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {oxyAvail} <span className="text-slate-400 font-normal">/ {h.bedStats.oxygen.total}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-500">General</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                        {genAvail} <span className="text-slate-400 font-normal">/ {h.bedStats.general.total}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHospitalDetail(h);
                    }}
                    className="min-h-[38px] px-4 py-2 border border-slate-300 group-hover:border-[#0F2942] text-[#0F2942] text-xs font-semibold rounded transition-colors whitespace-nowrap bg-white hover:bg-slate-50"
                  >
                    {language === 'kn' ? 'ಪೂರ್ಣ ಮಾಹಿತಿ' : 'Hospital Profile'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EDITORIAL ESSAY SECTION: PRIMARY HEALTHCARE IN KARNATAKA (Selector 4) */}
      <section className="bg-white border border-slate-200 p-8 sm:p-12 rounded space-y-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="text-[11px] font-mono uppercase text-[#0F2942] tracking-wider font-semibold">
            {language === 'kn' ? 'ವಿಶೇಷ ವರದಿ · ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು' : 'Public Healthcare Infrastructure · Ground Report'}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight text-balance">
            {language === 'kn'
              ? 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರದಿಂದ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳವರೆಗೆ: ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯದ ನೈಜ ಚಿತ್ರಣ.'
              : 'From Primary Health Centres to Civil Hospitals: Ground Realities in Karnataka.'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Documentary Photo Column (Selector 4) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden rounded border border-slate-200">
              <img
                src="/src/assets/images/karnataka_primary_health_centre_1793731310519.jpg"
                alt="Primary Health Centre PHC Halebeedu Hassan Karnataka"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
            </div>
            <div className="text-[11px] text-slate-600 leading-snug">
              <span className="font-semibold text-slate-900">Primary Health Centre (PHC) —</span> Outpatient clinic and maternal health registry, rural Karnataka.
            </div>
          </div>

          {/* Reading Prose Column */}
          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              In Karnataka, public healthcare serves as the vital lifeline for over 45 million citizens. When families seek urgent medical care, transparent, reliable information about doctor availability, active emergency wards, and medicine stocks is essential.
            </p>
            <p>
              Through Namma Arogya, our goal is to bridge the communication gap between rural citizens and public hospitals. Patients can verify hospital contacts before traveling, find participating ORS portals, and generate official complaint records for Karnataka Janaspandana.
            </p>

            {/* Editorial Pull Quote */}
            <div className="my-4 py-4 px-6 border-y border-slate-200 bg-slate-50">
              <blockquote className="font-serif italic text-base sm:text-lg text-slate-900 leading-snug">
                &quot;A transparent public healthcare system ensures that no citizen travels in uncertainty during an emergency. Verifiable information is the foundation of public trust.&quot;
              </blockquote>
              <div className="text-[11px] font-mono text-[#0F2942] mt-2 uppercase tracking-wider font-semibold">
                — Namma Arogya Public Healthcare Mission
              </div>
            </div>

            <p>
              Citizens can report medicine shortages, infrastructure issues, or staff unresponsiveness. Complaints generate structured reports with photographic documentation to facilitate genuine submissions to the state grievance portals.
            </p>
          </div>
        </div>
      </section>

      {/* 5. GOVERNMENT COMMUNICATION & STATUTORY PORTALS */}
      <section className="bg-[#0F2942] text-slate-100 p-8 sm:p-12 rounded border border-[#1E3A8A]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-[11px] font-mono uppercase text-amber-300 tracking-wider flex items-center gap-2 font-medium">
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಸರ್ಕಾರಿ ದೂರು ನಿವಾರಣೆ' : 'Grievance Forwarding & Official Channels'}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {language === 'kn'
                ? 'ಕರ್ನಾಟಕ ಜನಸ್ಪಂದನ & ಸಿಪಿಗ್ರಾಂಸ್ ಅಧಿಕೃತ ಸಂಪರ್ಕ'
                : 'Government Communication Centre & Official Portals'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Grievances logged on Namma Arogya generate downloadable official complaint dossiers with unique tracking numbers. Direct portal links are provided for Karnataka Janaspandana (IPGRS) and Central CPGRAMS, along with verified District Health Officer (DHO) contact rosters.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <a
                href="https://ipgrs.karnataka.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-amber-300 font-medium flex items-center gap-1.5 underline underline-offset-2"
              >
                <span>Karnataka Janaspandana (IPGRS)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
              <span className="text-slate-400">·</span>
              <a
                href="https://pgportal.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-amber-300 font-medium flex items-center gap-1.5 underline underline-offset-2"
              >
                <span>CPGRAMS Portal (Govt. of India)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
              <span className="text-slate-400">·</span>
              <a
                href="https://karunadu.karnataka.gov.in/hfw/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-amber-300 font-medium flex items-center gap-1.5 underline underline-offset-2"
              >
                <span>Karnataka HFW Dept</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => setActiveTab('gov-comm')}
              className="min-h-[44px] px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded transition-colors shadow-xs text-center"
            >
              {language === 'kn' ? 'ಸರ್ಕಾರಿ ಸಂಪರ್ಕ ಕೇಂದ್ರ ತೆರೆಯಿರಿ' : 'Open Communication Centre'}
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className="min-h-[44px] px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded transition-colors shadow-xs text-center"
            >
              {language === 'kn' ? 'ದೂರು ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ' : 'Track Existing Ticket'}
            </button>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED PUBLIC HEALTH BULLETINS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="text-[11px] font-mono uppercase text-[#0F2942] tracking-wider font-semibold">
              {language === 'kn' ? 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು' : 'Public Health Bulletins'}
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              {language === 'kn' ? 'ಆರೋಗ್ಯ ಇಲಾಖೆಯ ಇತ್ತೀಚಿನ ಪ್ರಕಟಣೆಗಳು' : 'Health Advisories & Public Notices'}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">Karnataka Field Bulletins</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-white p-5 rounded border border-slate-200 space-y-2.5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase mb-1">
                  <span className="text-[#0F2942] font-bold">{n.category}</span>
                  <span>{n.date}</span>
                </div>
                <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {n.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-800 font-medium flex items-center justify-between">
                <span className="truncate">{n.hospitalName}</span>
                <span className="text-emerald-700 font-mono shrink-0 font-medium">Verified Notice</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
