import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Search,
  Building2,
  Clock,
  CheckCircle,
  CalendarPlus,
  SlidersHorizontal,
  DoorOpen,
  BadgeCheck,
  ShieldCheck,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const DoctorDirectoryView: React.FC = () => {
  const {
    doctors,
    hospitals,
    setActiveTab,
    setPreselectedHospitalId,
    setPreselectedDoctorId,
    dataFilterMode,
    setDataFilterMode,
    language
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);

  const specialties = [
    'All',
    ...Array.from(new Set(doctors.map((d) => d.specialization.split('&')[0].trim()))),
  ];

  const hospitalNames = ['All', ...Array.from(new Set(hospitals.map((h) => h.name)))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.councilRegistrationNumber && doc.councilRegistrationNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === 'All' || doc.specialization.includes(selectedSpecialty);

    const matchesHospital =
      selectedHospital === 'All' || doc.hospitalName === selectedHospital;

    const matchesAvailability = !onlyAvailableToday || doc.status === 'Available Today';
    const matchesProvenance =
      dataFilterMode === 'all'
        ? true
        : dataFilterMode === 'verified_only'
        ? doc.isVerifiedReal === true
        : doc.isVerifiedReal === false;

    return matchesSearch && matchesSpecialty && matchesHospital && matchesAvailability && matchesProvenance;
  });

  const handleBookWithDoctor = (doc: (typeof doctors)[0]) => {
    setPreselectedHospitalId(doc.hospitalId);
    setPreselectedDoctorId(doc.id);
    setActiveTab('appointment');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header & Filter Masthead */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold flex items-center gap-2">
            <span>KARNATAKA MEDICAL COUNCIL (KMC) REGISTERED SPECIALISTS</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">PUBLIC CIVIL ROSTER</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {language === 'kn' ? 'ತಜ್ಞ ವೈದ್ಯರು ಮತ್ತು ಒಪಿಡಿ ವೇಳಾಪಟ್ಟಿ' : 'Specialist Physician & OPD Roster'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'kn'
              ? 'ಕರ್ನಾಟಕದ ಸರ್ಕಾರಿ ಬೋಧನಾ ಆಸ್ಪತ್ರೆಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ಸಿವಿಲ್ ಆಸ್ಪತ್ರೆಗಳ ವೈದ್ಯಕೀಯ ಕೌನ್ಸಿಲ್ ನೋಂದಾಯಿತ ತಜ್ಞರ ದೈನಂದಿನ ಒಪಿಡಿ ಕರ್ತವ್ಯ ವಿವರ.'
              : 'Verified clinical OPD schedules, consultation chambers, and Karnataka Medical Council (KMC) statutory credentials for state civil hospital specialists and teaching hospitals.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === 'kn'
                  ? 'ವೈದ್ಯರ ಹೆಸರು, ವಿಭಾಗ, ಆಸ್ಪತ್ರೆ ಅಥವಾ KMC ನೋಂದಣಿ ಸಂಖ್ಯೆಯಿಂದ ಹುಡುಕಿ...'
                  : 'Search by physician name, clinical specialty, hospital, or KMC registration number...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#0F2942] focus:bg-white transition-colors"
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

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-1 text-slate-600 font-medium mr-1 font-mono text-[11px] uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>Filters:</span>
            </div>

            {/* Specialty dropdown */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              aria-label="Filter by medical specialty"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:border-[#0F2942]"
            >
              {specialties.map((s) => (
                <option key={s} value={s}>
                  Specialty: {s}
                </option>
              ))}
            </select>

            {/* Hospital dropdown */}
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              aria-label="Filter by hospital facility"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:border-[#0F2942]"
            >
              {hospitalNames.map((h) => (
                <option key={h} value={h}>
                  Hospital: {h}
                </option>
              ))}
            </select>

            {/* Available Today toggle */}
            <button
              onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
              className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors border text-xs ${
                onlyAvailableToday
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#0F2942]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available Today</span>
            </button>

            {/* Data Mode Filter */}
            <div className="flex items-center bg-slate-50 p-0.5 rounded border border-slate-200 ml-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 font-mono">Registry:</span>
              <button
                onClick={() => setDataFilterMode('all')}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  dataFilterMode === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Specialists
              </button>
              <button
                onClick={() => setDataFilterMode('verified_only')}
                className={`px-2.5 py-1 text-xs rounded transition-all flex items-center gap-1 ${
                  dataFilterMode === 'verified_only'
                    ? 'bg-[#0F2942] text-white font-semibold'
                    : 'text-slate-600 hover:text-[#0F2942]'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>Verified KMC Only</span>
              </button>
              <button
                onClick={() => setDataFilterMode('demo_only')}
                className={`px-2.5 py-1 text-xs rounded transition-all ${
                  dataFilterMode === 'demo_only'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo Records
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Pill */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Duty Advisory:</strong> Senior government doctors may be deployed to emergency trauma, ICU rounds, or surgical theaters without advance notice. Contact the hospital reception before traveling from rural areas.
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-600">
        <div>
          Showing <strong className="text-slate-900 font-semibold font-mono">{filteredDoctors.length}</strong> practicing specialists across Karnataka
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Karnataka State Health Services Cadre
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white p-12 text-center rounded border border-slate-200">
          <div className="w-12 h-12 bg-slate-50 rounded border border-slate-200 flex items-center justify-center mx-auto text-slate-500 mb-3">
            <Stethoscope className="w-6 h-6 text-[#0F2942]" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-base">No specialists found matching criteria</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Try resetting your search filters or clearing the specialty criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('All');
              setSelectedHospital('All');
              setOnlyAvailableToday(false);
              setDataFilterMode('all');
            }}
            className="mt-4 px-4 py-2 bg-[#0F2942] text-white text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <article
              key={doc.id}
              className="bg-white rounded border border-slate-200 hover:border-[#0F2942] p-5 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded border border-slate-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif font-bold text-base text-slate-900 truncate">
                        {doc.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#0F2942] shrink-0 border border-[#0F2942]/20 bg-slate-50 px-1.5 py-0.5 rounded">
                        {doc.status}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[#0F2942]">
                      {doc.specialization}
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span>{doc.qualification}</span>
                      <span>·</span>
                      <span>{doc.experienceYears}+ yrs experience</span>
                    </div>

                    {/* Medical Council Registration & Provenance Badge */}
                    <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                      {doc.councilRegistrationNumber && (
                        <span className="font-mono text-slate-900 font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          KMC Reg: {doc.councilRegistrationNumber}
                        </span>
                      )}
                      {doc.isVerifiedReal ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1 text-[11px]">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified Officer</span>
                        </span>
                      ) : (
                        <span className="italic text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          Sample Roster
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hospital & Location Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#0F2942] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-900 line-clamp-1">{doc.hospitalName}</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Room {doc.roomNumber}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.opdTimings}</span>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="pt-1 flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 font-mono text-[10px] uppercase">OPD Days:</span>
                    <div className="flex flex-wrap gap-1">
                      {doc.availableDays.map((day, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded border border-slate-200 text-slate-800 font-mono font-medium"
                        >
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-600 font-mono">Free Government Consultation</span>
                <button
                  onClick={() => handleBookWithDoctor(doc)}
                  className="bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs px-3.5 py-2 rounded transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>Official OPD Booking</span>
                  <ArrowUpRight className="w-3 h-3 opacity-80" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
