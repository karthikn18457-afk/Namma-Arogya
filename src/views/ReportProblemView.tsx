import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCategory, ComplaintSeverity } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Clock,
  ArrowRight,
  Pill,
  UserX,
  Wrench,
  Bed,
  Droplets,
  HelpCircle,
  Upload,
  X,
  Sparkles,
  ShieldAlert,
  Info,
  ExternalLink,
  Download
} from 'lucide-react';

export const ReportProblemView: React.FC = () => {
  const {
    hospitals,
    addComplaint,
    preselectedReportHospitalId,
    setPreselectedReportHospitalId,
    setTrackingQueryId,
    setActiveTab,
    language
  } = useApp();

  const [hospitalId, setHospitalId] = useState<string>(
    preselectedReportHospitalId || hospitals[0]?.id || ''
  );
  const [category, setCategory] = useState<ComplaintCategory>('No Medicines');
  const [severity, setSeverity] = useState<ComplaintSeverity>('High');
  const [department, setDepartment] = useState<string>('Pharmacy / Jan Aushadhi Counter');
  const [description, setDescription] = useState<string>('');
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedReportHospitalId) {
      setHospitalId(preselectedReportHospitalId);
    }
  }, [preselectedReportHospitalId]);

  const categories: {
    id: ComplaintCategory;
    label: string;
    labelKn: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
  }[] = [
    { id: 'No Medicines', label: 'No Medicines', labelKn: 'ಔಷಧಿಗಳ ಕೊರತೆ', icon: Pill, desc: 'Essential generic drugs or IV fluids out of stock in hospital pharmacy' },
    { id: 'Poor Sanitation', label: 'Poor Sanitation', labelKn: 'ಅಸ್ವಚ್ಛತೆ', icon: Sparkles, desc: 'Unhygienic wards, dirty washrooms, medical waste buildup' },
    { id: 'Doctor Unavailability', label: 'Doctor Absent', labelKn: 'ವೈದ್ಯರ ಗೈರುಹಾಜರಿ', icon: UserX, desc: 'Absence of duty specialist in OPD or casualty ward' },
    { id: 'Broken Equipment', label: 'Broken Equipment', labelKn: 'ಉಪಕರಣಗಳ ದೋಷ', icon: Wrench, desc: 'Defective diagnostic X-Ray, CT scanner, ultrasound, or elevator' },
    { id: 'Bed Shortage', label: 'Bed Shortage', labelKn: 'ಹಾಸಿಗೆಗಳ ಕೊರತೆ', icon: Bed, desc: 'Emergency admission denial despite reported bed vacancies' },
    { id: 'Water Problems', label: 'Water Problems', labelKn: 'ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ', icon: Droplets, desc: 'Drinking water outage or sanitation pipeline stoppage' },
    { id: 'Other', label: 'Other Grievance', labelKn: 'ಇತರ ಕುಂದುಕೊರತೆ', icon: HelpCircle, desc: 'Administrative grievance, protocol violations, or counter delays' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!hospitalId) {
      setFormError('Please select a government hospital.');
      return;
    }
    if (!description.trim() || description.length < 15) {
      setFormError('Please provide a specific description of the issue (at least 15 characters).');
      return;
    }
    if (!citizenName.trim()) {
      setFormError('Please enter your full legal name.');
      return;
    }
    if (!citizenPhone.trim() || citizenPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number to receive resolution updates.');
      return;
    }

    const hospitalObj = hospitals.find((h) => h.id === hospitalId);

    const newTicket = addComplaint({
      citizenName: citizenName.trim(),
      citizenPhone: citizenPhone.trim(),
      hospitalId,
      hospitalName: hospitalObj?.name || 'District Civil Hospital',
      category,
      severity,
      department: department.trim() || 'General Hospital Wing',
      description: description.trim(),
      photoUrl: photoPreview || undefined,
      publicTrackingToken: `NA-KA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    });

    setSubmittedId(newTicket.id);
    setPreselectedReportHospitalId(null);
  };

  const handleCopyId = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackNow = () => {
    if (submittedId) {
      setTrackingQueryId(submittedId);
      setActiveTab('track');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-2 shadow-xs">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold flex items-center gap-2">
          <span>CITIZEN HEALTHCARE GRIEVANCE DESK</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600">NAMMA AROGYA</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          {language === 'kn' ? 'ಆಸ್ಪತ್ರೆಯ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ' : 'Report a Hospital Problem / Grievance'}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {language === 'kn'
            ? 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳ ವೈಫಲ್ಯಗಳು, ಔಷಧಿ ಕೊರತೆ ಅಥವಾ ಅಸ್ವಚ್ಛತೆಯನ್ನು ದಾಖಲಿಸಿ. ಪ್ರತಿ ದೂರಿಗೆ ಪ್ರತ್ಯೇಕ ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ ದೊರೆಯುತ್ತದೆ.'
            : 'Document and track hospital issues such as generic medicine shortages, sanitation failures, or staff unavailability. Generate an official complaint dossier for submission to official government portals.'}
        </p>
      </div>

      {/* Demonstration Record Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-900">
            Important Demonstration &amp; Submission Disclosure:
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Namma Arogya stores this complaint as an independent citizen record. Because this platform is an academic student project, reports are <strong>NOT automatically transmitted to the Karnataka Government</strong> without authorized integration. To formally file a legal complaint, please use your generated report with Karnataka Janaspandana (IPGRS) or Central CPGRAMS.
          </p>
        </div>
      </div>

      {/* Success State / Ticket Generated */}
      {submittedId ? (
        <div className="max-w-xl mx-auto bg-white rounded border border-slate-200 p-6 sm:p-10 text-center space-y-6 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold">
              Grievance Record Created
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Reference Ticket Issued
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your issue has been logged into the local database with status <strong>Received</strong>.
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 flex items-center justify-between gap-3 max-w-sm mx-auto">
            <div className="text-left font-mono">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Docket Reference ID</div>
              <div className="text-xl font-bold text-[#0F2942]">{submittedId}</div>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors font-mono"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 text-left">
            <strong>Demonstration Status:</strong> This record is stored in your session database. Use the Government Communication Centre to generate an official PDF/dossier for Karnataka Janaspandana submission.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleTrackNow}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Track Docket Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setSubmittedId(null);
                setDescription('');
                setPhotoPreview(null);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 text-slate-900 text-xs font-medium rounded hover:bg-slate-50 transition-colors"
            >
              Lodge Another Grievance
            </button>
          </div>
        </div>
      ) : (
        /* Grievance Submission Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-6 shadow-xs"
          >
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Step 1: Hospital and Department */}
            <div>
              <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                1. Affected Healthcare Facility
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Select Government Hospital *
                  </label>
                  <select
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
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
                    Hospital Department / Ward Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Inpatient Ward 3, Ground Floor Pharmacy, Casualty Room 102..."
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Grievance Category Selection */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                2. Grievance Category
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`cursor-pointer p-3 rounded border transition-colors flex items-start gap-3 ${
                        isSelected
                          ? 'bg-slate-50 border-[#0F2942] text-[#0F2942]'
                          : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#0F2942]' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-semibold text-xs leading-snug">
                          {cat.label} {language === 'kn' && `· ${cat.labelKn}`}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{cat.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Priority & Narrative */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                3. Issue Description &amp; Severity
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Urgency / Impact Level *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintSeverity[]).map((sev) => (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setSeverity(sev)}
                        className={`py-2 text-xs font-medium rounded border transition-colors font-mono ${
                          severity === sev
                            ? 'bg-[#0F2942] text-white border-[#0F2942]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#0F2942]'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Detailed Statement of Problem *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific details: date, time, what happened, who was consulted, and how patients are impacted..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Photo Evidence Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Photographic Proof (Optional)
                  </label>
                  {photoPreview ? (
                    <div className="relative inline-block border border-slate-200 rounded overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Uploaded preview"
                        className="w-40 h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer border border-dashed border-slate-300 rounded p-4 flex flex-col items-center justify-center text-xs text-slate-600 hover:border-[#0F2942] bg-slate-50">
                      <Upload className="w-5 h-5 text-[#0F2942] mb-1" />
                      <span>Upload JPG or PNG photograph</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-mono">Maximum file size: 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Complainant Details */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="font-serif font-bold text-base text-slate-900 mb-3">
                4. Citizen Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Complainant Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Kumar"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                    Mobile Phone (For Status SMS &amp; Verification) *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-semibold text-xs py-3.5 rounded flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Log Grievance &amp; Issue Reference Docket</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-2 font-mono">
                Stored for citizen tracking and generation of official grievance dossiers.
              </p>
            </div>
          </form>

          {/* Right Column: Citizen Redressal Guidelines */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded border border-slate-200 text-xs space-y-3 shadow-xs">
              <h3 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0F2942]" />
                Administrative Benchmark SLAs
              </h3>
              <div className="space-y-2 text-slate-600 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block">Emergency / Bed Shortage:</strong>
                  <span>Triage within 4 hours by District Inspection Squad.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block">Medicine Stock Shortages:</strong>
                  <span>Replenishment within 24 hours via Jan Aushadhi buffer.</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <strong className="text-slate-900 block">Sanitation &amp; Equipment:</strong>
                  <span>Remedial inspection and technician dispatch within 48 hours.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A1E31] text-white p-5 rounded border border-[#1E3A8A] text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
                <ShieldAlert className="w-4 h-4" />
                <span>Government Submission</span>
              </div>
              <h4 className="font-semibold text-white font-serif">Official Karnataka Janaspandana</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                For legally binding government investigation, please take the docket generated here and submit it directly to Karnataka Janaspandana (ipgrs.karnataka.gov.in).
              </p>
              <div className="pt-2">
                <a
                  href="https://ipgrs.karnataka.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-amber-300 hover:underline text-[11px] font-medium"
                >
                  <span>Open Janaspandana Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
