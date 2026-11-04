import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  Bed,
  CheckCircle2,
  CalendarPlus,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';

export const HospitalModal: React.FC = () => {
  const {
    selectedHospitalDetail,
    setSelectedHospitalDetail,
    setActiveTab,
    setPreselectedHospitalId,
    setPreselectedReportHospitalId,
    doctors,
    language
  } = useApp();

  if (!selectedHospitalDetail) return null;

  const h = selectedHospitalDetail;
  const hospitalDoctors = doctors.filter((doc) => doc.hospitalId === h.id);

  const calculateAvail = (total: number, occupied: number) => {
    const avail = total - occupied;
    const pct = Math.round((occupied / total) * 100);
    return { avail, pct };
  };

  const icu = calculateAvail(h.bedStats.icu.total, h.bedStats.icu.occupied);
  const oxy = calculateAvail(h.bedStats.oxygen.total, h.bedStats.oxygen.occupied);
  const gen = calculateAvail(h.bedStats.general.total, h.bedStats.general.occupied);
  const ped = calculateAvail(h.bedStats.pediatric.total, h.bedStats.pediatric.occupied);

  const handleBookAppointment = () => {
    setPreselectedHospitalId(h.id);
    setSelectedHospitalDetail(null);
    setActiveTab('appointment');
  };

  const handleReportProblem = () => {
    setPreselectedReportHospitalId(h.id);
    setSelectedHospitalDetail(null);
    setActiveTab('report');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with authentic architectural image */}
        <div className="relative h-44 sm:h-52 bg-[#0A1E31] shrink-0">
          <img
            src={h.imageUrl}
            alt={h.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E31] via-[#0A1E31]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => setSelectedHospitalDetail(null)}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & metadata inside banner */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 mb-1 font-mono">
              <span>{h.type}</span>
              <span>·</span>
              <span>{h.district}</span>
              <span>·</span>
              <span className="text-white">{h.status}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
              {h.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
          {/* Statutory Verification Provenance Strip */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-slate-900">Verification Status: </span>
              {h.dataSource} · Verified on <span className="font-mono text-slate-900">{h.verificationDate}</span> by{' '}
              <span className="font-medium text-slate-900">{h.verifiedBy}</span>.
              {h.isOrsParticipating && (
                <span className="ml-1 text-[#0F2942] font-mono font-semibold">
                  (Official ORS Code: {h.orsHospitalCode || 'KA-CIVIL'})
                </span>
              )}
            </div>
          </div>

          {/* Contact & Address Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-500">Campus Address</div>
              <div className="text-xs text-slate-900 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F2942] shrink-0 mt-0.5" />
                <span>{h.address}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-500">Emergency Telephony</div>
              <div className="text-xs font-mono">
                <span className="text-rose-700 font-bold">Trauma Casualty: {h.emergencyHelpline}</span>
                <div className="text-slate-600 mt-0.5">Reception: {h.phone}</div>
              </div>
            </div>
          </div>

          {/* Bed Occupancy Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-xs text-slate-900">
                Inpatient Bed Allocation &amp; Capacity Audit
              </span>
              <span className="font-mono text-[10px] text-slate-500">HMIS Telemetry</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-mono uppercase">ICU Vacancy</div>
                <div className="font-mono text-lg font-bold text-[#0F2942] mt-1 tabular-nums">
                  {icu.avail}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {h.bedStats.icu.total}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{icu.pct}% occupied</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Oxygen Beds</div>
                <div className="font-mono text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {oxy.avail}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {h.bedStats.oxygen.total}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{oxy.pct}% occupied</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-mono uppercase">General Ward</div>
                <div className="font-mono text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {gen.avail}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {h.bedStats.general.total}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{gen.pct}% occupied</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Pediatric</div>
                <div className="font-mono text-lg font-bold text-slate-900 mt-1 tabular-nums">
                  {ped.avail}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {h.bedStats.pediatric.total}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{ped.pct}% occupied</div>
              </div>
            </div>
          </div>

          {/* Key Services & Facilities */}
          <div>
            <div className="font-semibold text-xs text-slate-900 mb-2">Available Diagnostic &amp; Clinical Facilities</div>
            <div className="flex flex-wrap gap-1.5">
              {h.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs bg-slate-100 border border-slate-200 text-slate-800 rounded"
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Departments */}
          <div>
            <div className="font-semibold text-xs text-slate-900 mb-2">Active Clinical Departments</div>
            <div className="flex flex-wrap gap-1.5">
              {h.departments.map((dept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-slate-100 border border-slate-200 text-[#0F2942] font-medium rounded"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Doctors at this hospital */}
          {hospitalDoctors.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-slate-900 mb-2 flex items-center justify-between">
                <span>Specialists on Active OPD Roster</span>
                <span className="text-slate-500 font-normal">{hospitalDoctors.length} doctors registered</span>
              </div>
              <div className="space-y-1.5">
                {hospitalDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 rounded border border-slate-200 bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">{doc.name}</div>
                      <div className="text-[11px] text-slate-600">
                        {doc.specialization} · Room {doc.roomNumber} · {doc.opdTimings} ·{' '}
                        <span className="text-[#0F2942] font-mono">{doc.councilRegistrationNumber}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nodal Officer Contact */}
          <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-3">
            <span className="font-semibold text-slate-900">Hospital Superintendent / Nodal Grievance Officer: </span>
            {h.nodalOfficer}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleReportProblem}
            className="px-3.5 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100/60 border border-amber-300 rounded transition-colors flex items-center gap-1.5 bg-amber-50"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Lodge Grievance for this Facility</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedHospitalDetail(null)}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded transition-colors bg-white hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={handleBookAppointment}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0F2942] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-amber-300" />
              <span>Book OPD Appointment (ORS)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
