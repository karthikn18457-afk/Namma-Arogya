import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital } from '../types';
import {
  Building2,
  Clock,
  Printer,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  ClipboardList,
  BadgeCheck,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

export const AppointmentBookingView: React.FC = () => {
  const {
    hospitals,
    doctors,
    preselectedHospitalId,
    preselectedDoctorId,
    language
  } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(
    preselectedHospitalId || hospitals[0]?.id || ''
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');

  const [bookingMode, setBookingMode] = useState<'ors_official' | 'walkin_checklist'>('ors_official');

  // Walk-in Checklist state
  const [visitDate, setVisitDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  interface SavedChecklist {
    checklistId: string;
    createdAt: string;
    hospitalName: string;
    hospitalType: string;
    district: string;
    department: string;
    doctorName: string;
    opdHours: string;
    roomNumber: string;
    visitDate: string;
    patientName: string;
    patientAge: number;
    patientGender: 'Male' | 'Female' | 'Other';
    patientPhone: string;
    symptoms: string;
  }
  const [savedChecklist, setSavedChecklist] = useState<SavedChecklist | null>(null);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (preselectedHospitalId) {
      setSelectedHospitalId(preselectedHospitalId);
    }
  }, [preselectedHospitalId]);

  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
      const doc = doctors.find((d) => d.id === preselectedDoctorId);
      if (doc) {
        setSelectedHospitalId(doc.hospitalId);
        setSelectedDepartment(doc.department);
      }
    }
  }, [preselectedDoctorId, doctors]);

  const currentHospital: Hospital | undefined = hospitals.find((h) => h.id === selectedHospitalId);
  const availableDepartments = currentHospital?.departments || [];

  useEffect(() => {
    if (availableDepartments.length > 0 && !availableDepartments.includes(selectedDepartment)) {
      setSelectedDepartment(availableDepartments[0]);
    }
  }, [selectedHospitalId, availableDepartments, selectedDepartment]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.hospitalId === selectedHospitalId &&
      (!selectedDepartment || d.department === selectedDepartment || d.specialization.includes(selectedDepartment))
  );

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const handleGenerateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedHospitalId) {
      setFormError('Please select a government civil hospital or health center.');
      return;
    }
    if (!selectedDepartment) {
      setFormError('Please select a clinical department.');
      return;
    }
    if (!patientName.trim()) {
      setFormError('Please enter the patient legal full name.');
      return;
    }
    if (!patientAge || parseInt(patientAge) <= 0) {
      setFormError('Please enter a valid age in years.');
      return;
    }

    const checklistData = {
      checklistId: `NA-OPD-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('en-IN'),
      hospitalName: currentHospital?.name || 'District Civil Hospital',
      hospitalType: currentHospital?.type || 'Government Hospital',
      district: currentHospital?.district || '',
      department: selectedDepartment,
      doctorName: selectedDoctor?.name || 'Duty Medical Officer (OPD)',
      opdHours: selectedDoctor?.opdTimings || '09:00 AM – 01:00 PM',
      roomNumber: selectedDoctor?.roomNumber || 'Counter 1 / Triage Desk',
      visitDate,
      patientName: patientName.trim(),
      patientAge: parseInt(patientAge),
      patientGender,
      patientPhone: patientPhone.trim() || 'N/A',
      symptoms: symptoms.trim() || 'General OPD consultation and checkup',
    };

    setSavedChecklist(checklistData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-5 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold flex items-center gap-2">
            <span>GOVERNMENT OPD REGISTRATION PROTOCOL</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">ORS.GOV.IN GATEWAY</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಒಪಿಡಿ ನೋಂದಣಿ ಮತ್ತು ಅಧಿಕೃತ ORS ಪೋರ್ಟಲ್' : 'Hospital OPD Registration & Official ORS Gateway'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'kn'
              ? 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ, ಕರ್ನಾಟಕದ ಭಾಗವಹಿಸುವ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳ ಅಧಿಕೃತ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ರಾಷ್ಟ್ರೀಯ ಆನ್‌ಲೈನ್ ನೋಂದಣಿ ವ್ಯವಸ್ಥೆ (ORS.gov.in) ಮೂಲಕ ಕಾಯ್ದಿರಿಸಲಾಗುತ್ತದೆ. ಅನಧಿಕೃತ ಟೋಕನ್‌ಗಳನ್ನು ನೀಡಲಾಗುವುದಿಲ್ಲ.'
              : 'In adherence to public healthcare integrity standards, official appointments at participating Karnataka government hospitals are booked directly through the National Online Registration System (ORS.gov.in). We never issue unverified or simulated booking tokens.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={() => setBookingMode('ors_official')}
            className={`px-4 py-2 text-xs font-semibold rounded flex items-center gap-2 transition-colors border ${
              bookingMode === 'ors_official'
                ? 'bg-[#0F2942] text-white border-[#0F2942]'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#0F2942]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Government ORS Portal (ors.gov.in)</span>
          </button>

          <button
            onClick={() => setBookingMode('walkin_checklist')}
            className={`px-4 py-2 text-xs font-semibold rounded flex items-center gap-2 transition-colors border ${
              bookingMode === 'walkin_checklist'
                ? 'bg-[#0F2942] text-white border-[#0F2942]'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#0F2942]'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-amber-300" />
            <span>Walk-in OPD Queue Preparation Checklist</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {bookingMode === 'ors_official' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Hospital & Department Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="font-serif font-bold text-base text-slate-900">
                  1. Select Hospital &amp; Department
                </h2>
                {currentHospital?.isOrsParticipating ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>ORS Active Facility</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Walk-in Counter Facility</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Target Government Hospital
                  </label>
                  <select
                    value={selectedHospitalId}
                    onChange={(e) => {
                      setSelectedHospitalId(e.target.value);
                      setSelectedDoctorId('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.district}) {h.isOrsParticipating ? '· [ORS Online]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Target Clinical Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedDoctorId('');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                  >
                    {availableDepartments.map((dept, idx) => (
                      <option key={idx} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Hospital Technical Registry Details */}
              {currentHospital && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <div className="font-serif font-bold text-slate-900 text-sm">{currentHospital.name}</div>
                      <div className="text-slate-600 text-[11px]">
                        {currentHospital.type} · {currentHospital.district}
                      </div>
                    </div>
                    {currentHospital.orsHospitalCode && (
                      <div className="px-2.5 py-1 bg-white border border-slate-200 rounded text-right">
                        <div className="text-[9px] text-slate-500 uppercase font-mono font-semibold">NIC Hospital Code</div>
                        <div className="font-mono font-bold text-xs text-[#0F2942]">
                          {currentHospital.orsHospitalCode}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-900">Hospital Contact: </span>
                      <span className="font-mono">{currentHospital.phone}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Emergency Helpline: </span>
                      <span className="font-mono text-rose-700 font-semibold">{currentHospital.emergencyHelpline}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-slate-900">Address: </span>
                      <span>{currentHospital.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Box based on ORS participation */}
              {currentHospital?.isOrsParticipating ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-slate-900">
                        Verified ORS Participating Hospital
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        This facility is active on the National Online Registration System (ORS). Citizens
                        can reserve official OPD consultation tokens directly with Aadhaar or Mobile OTP verification.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href="https://ors.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Proceed to Official ORS Portal (ors.gov.in)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>

                    <a
                      href="https://healthid.ndhm.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-medium py-2.5 px-4 rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Create Free ABHA Health ID</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-serif font-bold text-sm text-slate-900">
                        Hospital Manages Walk-in Triage Counters
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        This facility issues physical OPD registration tokens at the hospital counter. Use our
                        walk-in preparation checklist to prepare required documentation and arrive during counter hours.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setBookingMode('walkin_checklist')}
                    className="px-4 py-2 bg-[#0F2942] text-white text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5"
                  >
                    <span>Switch to Walk-in Preparation Checklist</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              )}
            </div>

            {/* Department Specialists Roster Preview */}
            <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-4 shadow-xs">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center justify-between">
                <span>Physicians in {selectedDepartment || 'Selected Department'}</span>
                <span className="text-xs font-mono font-normal text-slate-600">{filteredDoctors.length} available</span>
              </h3>

              {filteredDoctors.length === 0 ? (
                <p className="text-xs text-slate-600 py-2">
                  Duty Medical Officers (DMO) are on rotation for general OPD consultations during regular hours.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="font-semibold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-[#0F2942] font-medium">{doc.specialization}</div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                          {doc.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 pt-1 flex items-center justify-between border-t border-slate-200 font-mono">
                        <span>Room: {doc.roomNumber}</span>
                        <span>{doc.opdTimings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Step-by-Step Instructions & Integrity Notice */}
          <div className="space-y-4">
            <div className="bg-[#0A1E31] text-white p-6 rounded space-y-3 border border-[#1E3A8A]">
              <div className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Anti-Fraud &amp; Integrity Policy</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white">
                Official Ministry Gateway Only
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Namma Arogya adheres strictly to public health service integrity:
                <strong> we never generate simulated or unverified appointment tokens.</strong>
              </p>
              <div className="text-[11px] text-slate-300 space-y-1.5 pt-2 border-t border-slate-700">
                <div>• All appointment tokens originate exclusively from NIC servers.</div>
                <div>• Government OPD registrations are 100% free of charge.</div>
                <div>• Beware of touts claiming to sell OPD queue priority.</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-200 text-xs space-y-3 shadow-xs">
              <h4 className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#0F2942]" />
                How to Book on ORS (ors.gov.in)
              </h4>

              <ol className="space-y-2.5 text-slate-600 text-[11px] list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-900">Open ORS:</strong> Go to{' '}
                  <a href="https://ors.gov.in/" target="_blank" rel="noreferrer" className="text-[#0F2942] underline font-semibold">
                    ors.gov.in
                  </a>{' '}
                  and select &quot;Book Appointment Now&quot;.
                </li>
                <li>
                  <strong className="text-slate-900">Aadhaar / Mobile OTP:</strong> Verify patient identity securely.
                </li>
                <li>
                  <strong className="text-slate-900">Select Hospital:</strong> Pick {currentHospital?.name || 'Selected Hospital'}.
                </li>
                <li>
                  <strong className="text-slate-900">Confirm Specialty:</strong> Choose {selectedDepartment || 'Desired Department'}.
                </li>
                <li>
                  <strong className="text-slate-900">Official SMS:</strong> Receive an official token SMS from Government NIC.
                </li>
              </ol>

              <div className="pt-2 border-t border-slate-200">
                <a
                  href="https://ors.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-colors text-xs shadow-xs"
                >
                  <span>Open Official ORS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Walk-in Queue Preparation Checklist Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {savedChecklist ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs flex items-center justify-between gap-3 text-slate-900">
                  <div>
                    <div className="font-serif font-bold text-sm">Citizen Preparation Summary Created</div>
                    <div className="text-[11px] text-slate-600">
                      Carry this preparation summary alongside your valid photo ID to the hospital registration counter.
                    </div>
                  </div>
                  <button
                    onClick={() => setSavedChecklist(null)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0"
                  >
                    Edit Checklist
                  </button>
                </div>

                {/* Printable Document Card */}
                <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                  <div className="border-b border-slate-200 pb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#0F2942]">
                        CITIZEN SELF-SERVICE ASSISTANCE RECORD
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                        Hospital Visit Preparation Checklist
                      </h2>
                      <div className="text-xs text-slate-600">
                        {savedChecklist.hospitalName} ({savedChecklist.district})
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-right font-mono">
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">Checklist Reference</div>
                      <div className="font-bold text-xs text-[#0F2942]">
                        {savedChecklist.checklistId}
                      </div>
                      <div className="text-[9px] text-slate-500">{savedChecklist.createdAt}</div>
                    </div>
                  </div>

                  {/* Anti-fraud disclaimer banner */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Notice:</strong> This is an assistance document for queue planning.
                      It is <strong>not</strong> an official ORS appointment slip. Official tokens are issued at the hospital counter.
                    </span>
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Patient Name</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                        {savedChecklist.patientName}
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        {savedChecklist.patientAge} yrs · {savedChecklist.patientGender}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Department &amp; Room</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block truncate">
                        {savedChecklist.department}
                      </span>
                      <span className="text-[#0F2942] text-[11px] block truncate font-mono">
                        {savedChecklist.roomNumber}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Visit Date &amp; Hours</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
                        {savedChecklist.visitDate}
                      </span>
                      <span className="text-slate-600 text-[11px] block font-mono">
                        {savedChecklist.opdHours}
                      </span>
                    </div>
                  </div>

                  {/* Documents to bring */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="font-semibold text-xs text-slate-900">Mandatory Documentation to Present at Counter:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Aadhaar Card, Voter ID, or Govt Photo ID</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ration Card (BPL/APL) or Ayushman Card</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Previous prescription cards &amp; diagnostics</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active mobile phone for queue SMS</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Karnataka Public Hospital Consultations are 100% Free.
                    </span>
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>Print Checklist</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Checklist Form */
              <form
                onSubmit={handleGenerateChecklist}
                className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-6 shadow-xs"
              >
                {formError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                    Step 1: Facility &amp; Clinical Department
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                        Government Hospital *
                      </label>
                      <select
                        value={selectedHospitalId}
                        onChange={(e) => {
                          setSelectedHospitalId(e.target.value);
                          setSelectedDoctorId('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                      >
                        {hospitals.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.district})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                        Clinical Department *
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => {
                          setSelectedDepartment(e.target.value);
                          setSelectedDoctorId('');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                      >
                        {availableDepartments.map((dept, idx) => (
                          <option key={idx} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                    Step 2: Planned Visit Schedule
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                        Planned Consultation Date *
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                        Consulting Specialist (Optional)
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                      >
                        <option value="">Duty Medical Officer / General Triage</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                    Step 3: Patient Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                          Full Legal Patient Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Chandra Verma"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                          Age (Years) *
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 45"
                          min="1"
                          max="120"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                          Gender *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Male', 'Female', 'Other'] as const).map((g) => (
                            <button
                              type="button"
                              key={g}
                              onClick={() => setPatientGender(g)}
                              className={`py-2 text-xs font-medium rounded border transition-colors ${
                                patientGender === g
                                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0F2942]'
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                          Mobile Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                        Primary Complaint / Symptoms (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief notes to assist counter triage (e.g. ongoing joint pain, persistent cough for 4 days)..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-semibold text-xs py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <ClipboardList className="w-4 h-4 text-amber-300" />
                    <span>Generate Walk-in Visit Preparation Summary</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2 font-mono">
                    Creates an assistance summary for physical hospital counter check-in. No unverified tokens are generated.
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded border border-slate-200 text-xs space-y-3 shadow-xs">
              <h3 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0F2942]" />
                Official OPD Counter Hours
              </h3>
              <div className="space-y-2 text-slate-600 text-[11px] font-mono">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <span>General Registration:</span>
                  <span className="font-semibold text-slate-900">08:30 AM – 11:30 AM</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <span>Specialist Consultations:</span>
                  <span className="font-semibold text-slate-900">09:00 AM – 01:00 PM</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <span>Emergency / Casualty:</span>
                  <span className="font-semibold text-rose-700">Open 24/7 (Room 1)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded border border-slate-200 text-xs space-y-2 text-slate-600">
              <h4 className="font-semibold text-slate-900 font-serif">Senior Citizen Priority Counters</h4>
              <p className="text-[11px] leading-relaxed">
                Karnataka district civil hospitals operate dedicated priority queues (Counter 1 &amp; 2)
                for senior citizens (60+), pregnant women, and persons with disabilities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
