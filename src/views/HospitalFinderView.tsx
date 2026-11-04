import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  ShieldAlert,
  Navigation,
  CalendarPlus,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  Info,
  CheckCircle2
} from 'lucide-react';

export const HospitalFinderView: React.FC = () => {
  const {
    hospitals,
    setSelectedHospitalDetail,
    setPreselectedHospitalId,
    setPreselectedReportHospitalId,
    setActiveTab,
    dataFilterMode,
    setDataFilterMode,
    language
  } = useApp();

  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [onlyEmergency, setOnlyEmergency] = useState<boolean>(false);

  const districts = ['All', ...Array.from(new Set(hospitals.map((h) => h.district)))];
  const types = ['All', ...Array.from(new Set(hospitals.map((h) => h.type)))];

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.departments.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
      h.facilities.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict = selectedDistrict === 'All' || h.district === selectedDistrict;
    const matchesType = selectedType === 'All' || h.type === selectedType;
    const matchesEmergency = !onlyEmergency || h.emergencyServices;
    const matchesProvenance =
      dataFilterMode === 'all'
        ? true
        : dataFilterMode === 'verified_only'
        ? h.isVerifiedReal === true
        : h.isVerifiedReal === false;

    return matchesSearch && matchesDistrict && matchesType && matchesEmergency && matchesProvenance;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Editorial Header & Search Console */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-xs space-y-6">
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-[#0F2942] uppercase tracking-wider mb-2 flex items-center gap-2 font-semibold">
            <span>{language === 'kn' ? 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳ ಪಟ್ಟಿ' : 'CIVIL HEALTHCARE DIRECTORY'}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">31 Districts · Namma Arogya</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {language === 'kn' ? 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ' : 'Government Hospitals of Karnataka'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'kn'
              ? 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲಾ ಸಿವಿಲ್ ಆಸ್ಪತ್ರೆಗಳು, ಸರ್ಕಾರಿ ವೈದ್ಯಕೀಯ ಕಾಲೇಜುಗಳು, ತಾಲೂಕು ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳ (PHC) ಅಧಿಕೃತ ವಿವರಗಳು ಹಾಗೂ ತುರ್ತು ಸೇವೆಗಳು.'
              : 'Directory of verified district civil hospitals, state government medical college teaching hospitals, taluk general hospitals, and Primary Health Centres (PHC) across Karnataka. Review clinical departments, bed occupancy, and administrative helplines.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'kn'
                  ? 'ಆಸ್ಪತ್ರೆ ಹೆಸರು, ಜಿಲ್ಲೆ, ನಗರ ಅಥವಾ ವಿಭಾಗದಿಂದ ಹುಡುಕಿ (ಉದಾ: ವಿಕ್ಟೋರಿಯಾ, ಹಾಸನ, ಮಂಗಳೂರು)...'
                  : 'Search by hospital name, city, district, or clinical department (e.g. Victoria, Hassan, Mangaluru)...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-20 py-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#0F2942] focus:bg-white transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Structured Filter Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-1 text-slate-600 font-medium mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* District dropdown */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Filter by district"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:border-[#0F2942]"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? (language === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು' : 'All Districts') : d}
                </option>
              ))}
            </select>

            {/* Facility type dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter by facility type"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:border-[#0F2942]"
            >
              {types.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption === 'All' ? (language === 'kn' ? 'ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆ ವಿಧಗಳು' : 'All Facility Types') : typeOption}
                </option>
              ))}
            </select>

            {/* Emergency toggle */}
            <button
              onClick={() => setOnlyEmergency(!onlyEmergency)}
              className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors border ${
                onlyEmergency
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0F2942]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>24/7 Trauma Emergency Only</span>
            </button>

            {/* Provenance Filter */}
            <div className="flex items-center bg-slate-50 p-0.5 rounded border border-slate-200 ml-auto">
              <span className="text-[10px] uppercase font-mono text-slate-500 px-2">Verification:</span>
              <button
                onClick={() => setDataFilterMode('all')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  dataFilterMode === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setDataFilterMode('verified_only')}
                className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                  dataFilterMode === 'verified_only'
                    ? 'bg-[#0F2942] text-white font-semibold'
                    : 'text-slate-600 hover:text-[#0F2942]'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>Verified Real Only</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-600 font-mono">
        <div>
          Showing <strong className="text-slate-900">{filteredHospitals.length}</strong> public healthcare facilities
          {dataFilterMode === 'verified_only' && ' · Verified Official Registries Only'}
        </div>
        <div className="hidden sm:block">Public Health Infrastructure · Karnataka</div>
      </div>

      {/* Horizontal Listings */}
      {filteredHospitals.length === 0 ? (
        <div className="bg-white rounded p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-500 mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-base">No matching facilities found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, or reset your district and facility filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('All');
              setSelectedType('All');
              setOnlyEmergency(false);
              setDataFilterMode('all');
            }}
            className="mt-4 px-4 py-2 bg-[#0F2942] text-white text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHospitals.map((h) => {
            const availIcu = h.bedStats.icu.total - h.bedStats.icu.occupied;
            const availOxy = h.bedStats.oxygen.total - h.bedStats.oxygen.occupied;
            const availGen = h.bedStats.general.total - h.bedStats.general.occupied;

            return (
              <article
                key={h.id}
                className="bg-white rounded border border-slate-200 hover:border-[#0F2942] p-5 sm:p-6 transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left zone: Image + Info */}
                <div className="flex flex-col sm:flex-row items-start gap-5 flex-1 min-w-0">
                  {/* Architectural Hospital Image */}
                  <div className="w-full sm:w-48 h-36 rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <img
                      src={h.imageUrl}
                      alt={h.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-103"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#0A1E31]/85 text-white rounded">
                        {h.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-[#0F2942]">{h.district}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600">{h.type}</span>
                      <span className="text-slate-300">·</span>
                      {h.isVerifiedReal ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Official Record</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          <Info className="w-3 h-3 text-amber-600" />
                          <span>Not verified · Contact facility to confirm</span>
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => setSelectedHospitalDetail(h)}
                      className="font-serif text-lg sm:text-xl font-bold text-slate-900 hover:text-[#0F2942] cursor-pointer transition-colors leading-snug"
                    >
                      {h.name}
                    </h2>

                    <div className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#0F2942] shrink-0 mt-0.5" />
                      <span>{h.address}</span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span className="font-mono text-slate-900">{h.phone}</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#0F2942] font-semibold">Trauma Helpline:</span>
                        <span className="font-mono font-bold text-slate-900">{h.emergencyHelpline}</span>
                      </div>
                    </div>

                    {/* Department Tag Row */}
                    <div className="pt-1 text-[11px] text-slate-600 line-clamp-1">
                      <span className="text-slate-900 font-medium">Departments: </span>
                      {h.departments.join(' · ')}
                    </div>
                  </div>
                </div>

                {/* Right zone: Bed Numbers & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                  {/* Tabular Bed Breakdown */}
                  <div className="grid grid-cols-3 gap-3 text-right">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200 min-w-[70px]">
                      <div className="text-[10px] uppercase font-mono text-slate-500">ICU Beds</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums mt-0.5">
                        {availIcu} <span className="text-slate-400 font-normal text-[11px]">/ {h.bedStats.icu.total}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200 min-w-[70px]">
                      <div className="text-[10px] uppercase font-mono text-slate-500">Oxygen</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums mt-0.5">
                        {availOxy} <span className="text-slate-400 font-normal text-[11px]">/ {h.bedStats.oxygen.total}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200 min-w-[70px]">
                      <div className="text-[10px] uppercase font-mono text-slate-500">General</div>
                      <div className="font-mono font-bold text-sm text-slate-900 tabular-nums mt-0.5">
                        {availGen} <span className="text-slate-400 font-normal text-[11px]">/ {h.bedStats.general.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPreselectedHospitalId(h.id);
                        setActiveTab('appointment');
                      }}
                      className="min-h-[38px] px-3.5 py-1.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded transition-colors shadow-xs"
                    >
                      Book OPD (ORS)
                    </button>

                    <button
                      onClick={() => setSelectedHospitalDetail(h)}
                      className="min-h-[38px] px-3.5 py-1.5 border border-slate-300 hover:border-[#0F2942] text-[#0F2942] text-xs font-semibold rounded transition-colors flex items-center gap-1 bg-white hover:bg-slate-50"
                    >
                      <span>Full Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
