import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ForwardingStatus } from '../types';
import {
  ExternalLink,
  Building2,
  ShieldCheck,
  Send,
  FileText,
  Download,
  Printer,
  Search,
  Phone,
  Mail,
  MapPin,
  Copy,
  X,
  FileCheck,
  ShieldAlert,
  Edit3,
  Info
} from 'lucide-react';

export const GovernmentCommunicationCentreView: React.FC = () => {
  const {
    complaints,
    dhoContacts,
    forwardComplaintToGovt,
    language
  } = useApp();

  // Active Sub-view
  const [activeSubTab, setActiveSubTab] = useState<'forwarding' | 'portals' | 'dho-directory'>('forwarding');

  // Filter complaints
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected complaint for forwarding review (Admin action)
  const [selectedForForwarding, setSelectedForForwarding] = useState<Complaint | null>(null);
  const [selectedPortal, setSelectedPortal] = useState<string>('Karnataka Janaspandana (IPGRS)');
  const [ackNumberInput, setAckNumberInput] = useState<string>('');
  const [responseDetailsInput, setResponseDetailsInput] = useState<string>('');
  const [forwardingNotesInput, setForwardingNotesInput] = useState<string>('');
  const [forwardingOfficerInput, setForwardingOfficerInput] = useState<string>('Dr. Rajeshwar Sharma (CMO)');
  const [newForwardingStatus, setNewForwardingStatus] = useState<ForwardingStatus>('Forwarded');
  const [confirmedManualForwarding, setConfirmedManualForwarding] = useState<boolean>(false);
  const [forwardModalError, setForwardModalError] = useState<string>('');

  // Downloadable report modal / view
  const [reportModalComplaint, setReportModalComplaint] = useState<Complaint | null>(null);

  // Copy dossier state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // DHO directory search
  const [dhoSearch, setDhoSearch] = useState<string>('');

  const forwardingWorkflowStages: ForwardingStatus[] = [
    'Received',
    'Awaiting Forwarding',
    'Forwarded',
    'Acknowledged',
    'Action Taken',
    'Resolved',
  ];

  const getStepIndex = (status?: ForwardingStatus) => {
    if (!status) return 0;
    const idx = forwardingWorkflowStages.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const filteredComplaints = complaints.filter((c) => {
    const currentFwStatus = c.forwardingStatus || (c.status === 'Resolved' ? 'Resolved' : 'Received');
    const matchesStatus = statusFilter === 'All' || currentFwStatus === statusFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.officialAckNumber && c.officialAckNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredDhos = dhoContacts.filter(
    (d) =>
      d.district.toLowerCase().includes(dhoSearch.toLowerCase()) ||
      d.officerName.toLowerCase().includes(dhoSearch.toLowerCase()) ||
      d.jurisdictionHospitals.some((h) => h.toLowerCase().includes(dhoSearch.toLowerCase()))
  );

  const handleOpenForwardModal = (c: Complaint) => {
    setSelectedForForwarding(c);
    setSelectedPortal(c.forwardedToPortal || 'Karnataka Janaspandana (IPGRS)');
    setAckNumberInput(c.officialAckNumber || '');
    setResponseDetailsInput(c.officialResponseDetails || '');
    setForwardingNotesInput(c.forwardingNotes || '');
    setForwardingOfficerInput(c.forwardedBy || 'Dr. Rajeshwar Sharma (CMO)');
    setNewForwardingStatus(c.forwardingStatus === 'Received' || !c.forwardingStatus ? 'Forwarded' : c.forwardingStatus);
    setConfirmedManualForwarding(false);
    setForwardModalError('');
  };

  const handleSaveForwarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForForwarding) return;

    if (newForwardingStatus === 'Forwarded' && !confirmedManualForwarding) {
      setForwardModalError('Please certify that this complaint dossier has been manually transmitted to the authorized government portal.');
      return;
    }

    forwardComplaintToGovt(
      selectedForForwarding.id,
      selectedPortal,
      ackNumberInput.trim(),
      responseDetailsInput.trim(),
      forwardingOfficerInput.trim(),
      newForwardingStatus,
      forwardingNotesInput.trim()
    );

    setSelectedForForwarding(null);
  };

  const handleCopyDossier = (c: Complaint) => {
    const text = `NAMMA AROGYA – PUBLIC HEALTHCARE CITIZEN GRIEVANCE DOSSIER
Docket ID: ${c.id}
Hospital: ${c.hospitalName}
Department/Chamber: ${c.department}
Category: ${c.category} (Severity: ${c.severity})
Complainant: ${c.citizenName} (${c.citizenPhone})
Date Logged: ${c.submittedAt}

Description of Issue:
${c.description}

Official Acknowledgement Number: ${c.officialAckNumber || 'Pending Official Assignment'}
Portal: ${c.forwardedToPortal || 'Karnataka Janaspandana (ipgrs.karnataka.gov.in)'}
Notice: Prepared via Namma Arogya (Independent Academic Public Health Initiative)`;

    navigator.clipboard.writeText(text);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Editorial Header */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0F2942] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>OFFICIAL PUBLIC GRIEVANCE DISPATCH · INTER-AGENCY LIAISON</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {language === 'kn' ? 'ಸರ್ಕಾರಿ ಸಂಪರ್ಕ ಕೇಂದ್ರ' : 'Government Communication Centre'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {language === 'kn'
                ? 'ನಾಗರಿಕರ ದೂರುಗಳನ್ನು ಕರ್ನಾಟಕ ಜನಸ್ಪಂದನ (IPGRS) ಹಾಗೂ ಸಿಪಿಗ್ರಾಂಸ್ (CPGRAMS) ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ಅಧಿಕೃತವಾಗಿ ರವಾನಿಸುವ ಮತ್ತು ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಅಧಿಕಾರಿಗಳೊಂದಿಗೆ ಸಮನ್ವಯ ಸಾಧಿಸುವ ಕೇಂದ್ರ.'
                : 'Liaison gateway linking citizen hospital grievances with official portals (Karnataka Janaspandana IPGRS & CPGRAMS). Monitor formal dispatch, record statutory acknowledgment numbers, and coordinate with District Health Officers.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://ipgrs.karnataka.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="min-h-[42px] px-3.5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors font-mono shadow-xs"
            >
              <span>Janaspandana (ipgrs.karnataka.gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </a>
            <a
              href="https://pgportal.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="min-h-[42px] px-3.5 py-2 bg-slate-50 border border-slate-300 hover:border-[#0F2942] text-slate-800 text-xs font-medium rounded flex items-center gap-1.5 transition-colors font-mono"
            >
              <span>CPGRAMS (pgportal.gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-200">
          {[
            { id: 'forwarding', label: 'Grievance Forwarding Workflow', labelKn: 'ದೂರು ರವಾನೆ ಕಾರ್ಯವಿಧಾನ', icon: Send },
            { id: 'portals', label: 'Official Portals & Protocol', labelKn: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳು', icon: ShieldCheck },
            { id: 'dho-directory', label: 'District Health Officer (DHO) Directory', labelKn: 'ಡಿಎಚ್‌ಒ ಅಧಿಕಾರಿಗಳ ವಿವರ', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`min-h-[42px] px-4 py-2 text-xs font-medium rounded flex items-center gap-1.5 transition-colors border ${
                  isActive
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-slate-50 text-slate-800 hover:bg-white border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{language === 'kn' ? tab.labelKn : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regulatory Transparency Notice */}
      <div className="bg-amber-50/70 border-l-4 border-l-[#0F2942] border border-amber-200 rounded p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-800 leading-relaxed">
          <div className="font-mono font-bold text-[#0F2942] uppercase tracking-wider text-[11px] mb-1">
            GOVERNMENT FORWARDING DEMARCATION &amp; INTEGRITY NOTICE
          </div>
          <p className="text-slate-700">
            <strong className="text-slate-900">Clear demarcation between local demonstration logging and actual state submission:</strong> This console functions as an institutional preparation and audit desk. It does <strong className="text-slate-900">not claim automated background submission</strong> into Karnataka Janaspandana (IPGRS) or Central CPGRAMS systems without manual administrative confirmation.
          </p>
          <p className="mt-1.5 text-slate-700">
            Authorized representatives copy the generated incident dossier, lodge it manually via <span className="font-mono text-slate-900 font-semibold">ipgrs.karnataka.gov.in</span> or <span className="font-mono text-slate-900 font-semibold">pgportal.gov.in</span>, obtain the official acknowledgement receipt, and enter that reference number here.
          </p>
        </div>
      </div>

      {/* SUBTAB 1: Complaint Forwarding Workflow */}
      {activeSubTab === 'forwarding' && (
        <div className="space-y-6">
          {/* Workflow Stepper Guide */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-slate-900">
                  6-Stage Official Forwarding Protocol
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Standard operating procedure from citizen submission to certified redressal
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Karnataka Health Grievance SOP
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
              {forwardingWorkflowStages.map((st, i) => (
                <div key={st} className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded bg-[#0F2942] text-amber-300 font-mono font-bold text-xs flex items-center justify-center mx-auto mb-1.5">
                    {i + 1}
                  </div>
                  <div className="font-medium text-slate-900 text-[11px] leading-tight">{st}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {i === 0 && 'Logged by citizen'}
                    {i === 1 && 'Dossier compiled'}
                    {i === 2 && 'Transmitted to portal'}
                    {i === 3 && 'Ack # issued'}
                    {i === 4 && 'Inspection squad'}
                    {i === 5 && 'Remediation closed'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forwarding Table Filters */}
          <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-serif text-base font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0F2942]" />
                  <span>Complaint Forwarding Registry &amp; Tracking</span>
                </h3>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Generate downloadable incident dossiers or record official portal acknowledgement receipts.
                </p>
              </div>

              {/* Status filter & search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search ID, hospital, Ack #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-hidden font-mono"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by forwarding status"
                  className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-900 text-xs focus:outline-hidden font-mono"
                >
                  <option value="All">All Stages ({complaints.length})</option>
                  {forwardingWorkflowStages.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Complaints list */}
            <div className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <div className="p-10 text-center text-slate-500 text-xs">
                  No grievances match the selected forwarding filter.
                </div>
              ) : (
                filteredComplaints.map((c) => {
                  const fwStatus: ForwardingStatus =
                    c.forwardingStatus || (c.status === 'Resolved' ? 'Resolved' : 'Received');
                  const stepIndex = getStepIndex(fwStatus);

                  return (
                    <div
                      key={c.id}
                      className="p-5 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                    >
                      {/* Left: ID & Details */}
                      <div className="space-y-1.5 flex-1 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#0F2942]">
                            {c.id}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[#0F2942]/30 text-[#0F2942] bg-slate-50">
                            Stage {stepIndex + 1}/6: {fwStatus}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Logged: {c.submittedAt}
                          </span>
                        </div>

                        <div className="font-serif font-semibold text-sm text-slate-900">
                          {c.category} – {c.hospitalName}
                        </div>
                        <div className="text-slate-600 line-clamp-2 leading-relaxed">
                          {c.description}
                        </div>

                        {/* Official Ack Number and Portal */}
                        <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
                          {c.officialAckNumber ? (
                            <span className="font-mono text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 font-semibold">
                              Govt Ack Ref: <strong>{c.officialAckNumber}</strong>
                            </span>
                          ) : (
                            <span className="text-amber-800 border border-amber-200 px-2 py-0.5 rounded bg-amber-50 font-mono">
                              Awaiting Official Portal Ack #
                            </span>
                          )}

                          {c.forwardedToPortal && (
                            <span className="text-slate-600">
                              Channel: <strong className="text-slate-900">{c.forwardedToPortal}</strong>
                            </span>
                          )}

                          {c.photoUrl && (
                            <span className="text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px]">
                              Photo Attached
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Copy Dossier */}
                        <button
                          onClick={() => handleCopyDossier(c)}
                          className="min-h-[36px] px-3 py-1.5 bg-white border border-slate-300 hover:border-[#0F2942] text-slate-800 font-medium text-xs rounded flex items-center gap-1.5 transition-colors font-mono"
                          title="Copy formatted complaint text for easy pasting into Janaspandana or CPGRAMS"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{copiedId === c.id ? 'Copied' : 'Copy Dossier'}</span>
                        </button>

                        {/* Download Report Modal Trigger */}
                        <button
                          onClick={() => setReportModalComplaint(c)}
                          className="min-h-[36px] px-3 py-1.5 bg-slate-50 border border-[#0F2942] text-[#0F2942] hover:bg-white font-medium text-xs rounded flex items-center gap-1.5 transition-colors font-mono"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Incident Report</span>
                        </button>

                        {/* Admin Forwarding Review Option */}
                        <button
                          onClick={() => handleOpenForwardModal(c)}
                          className="min-h-[36px] px-3 py-1.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs rounded flex items-center gap-1.5 transition-colors font-mono shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Review &amp; Forward</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Official Portals Protocol */}
      {activeSubTab === 'portals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Karnataka Janaspandana Card */}
            <div className="bg-white p-6 sm:p-7 rounded border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F2942] border border-[#0F2942]/30 px-2 py-0.5 rounded bg-slate-50 font-semibold">
                    State Government Portal
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Government of Karnataka</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                  Karnataka Janaspandana (IPGRS)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  The Integrated Public Grievance Redressal System (IPGRS) is the official centralized portal of the Government of Karnataka. Citizens and administrators lodge grievances regarding Karnataka state health department hospitals, medical colleges, and generic drug stocks.
                </p>

                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                  <div className="font-semibold text-slate-900">Key Health Focus Areas:</div>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    <li>Government civil hospitals &amp; maternal health care centers</li>
                    <li>Jan Aushadhi generic drug stock availability &amp; free supply</li>
                    <li>Doctor attendance during OPD &amp; emergency casualty hours</li>
                    <li>Biomedical equipment functionality and ward sanitation</li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-500">
                  ipgrs.karnataka.gov.in
                </span>
                <a
                  href="https://ipgrs.karnataka.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[40px] px-3.5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors font-mono shadow-xs"
                >
                  <span>Open Janaspandana Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              </div>
            </div>

            {/* Central CPGRAMS Card */}
            <div className="bg-white p-6 sm:p-7 rounded border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 border border-slate-300 px-2 py-0.5 rounded bg-slate-50">
                    Central Government Portal
                  </span>
                  <span className="text-xs text-slate-500 font-mono">DARPG · Govt of India</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 leading-tight">
                  CPGRAMS (Central Grievance Portal)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  The Centralised Public Grievance Redress and Monitoring System (CPGRAMS) connects citizens with all Ministries and Departments of the Government of India, including the Ministry of Health and Family Welfare (MoHFW) and national health programs.
                </p>

                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                  <div className="font-semibold text-slate-900">Key Health Focus Areas:</div>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    <li>Ayushman Bharat / PM-JAY grievance redressal</li>
                    <li>National Health Mission (NHM) infrastructure</li>
                    <li>Central Government medical colleges &amp; tertiary hospitals</li>
                    <li>Biomedical equipment AMC warranties &amp; central supply chains</li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-500">
                  pgportal.gov.in
                </span>
                <a
                  href="https://pgportal.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[40px] px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors font-mono"
                >
                  <span>Open CPGRAMS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Submission Guidelines & Protocol */}
          <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-4 shadow-xs">
            <h3 className="font-serif text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#0F2942]" />
              <span>Standard Operating Procedure for Formal Forwarding</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-900">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="font-bold text-[#0F2942] font-mono">Step 1: Export Complaint Dossier</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Click &quot;Copy Dossier&quot; or &quot;Incident Report&quot; on any docket to obtain the structured statement, complainant contact, hospital address, and photographic proof.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="font-bold text-[#0F2942] font-mono">Step 2: Submit to Official Portal</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Open the official Karnataka Janaspandana or Central CPGRAMS portal, paste the dossier into the Department of Health and Family Welfare form, and submit with attached photos.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="font-bold text-[#0F2942] font-mono">Step 3: Record Acknowledgement Number</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Return to this Communication Centre and use &quot;Review &amp; Forward&quot; to enter the official registration number issued by the government portal for audit verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: District Health Officer (DHO) Directory */}
      {activeSubTab === 'dho-directory' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div>
              <h3 className="font-serif text-base font-semibold text-slate-900">
                District Health &amp; Family Welfare Officer (DHO) Directory
              </h3>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Direct statutory escalation contacts for Karnataka district civil hospitals and maternal facilities
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search district, officer, hospital..."
                value={dhoSearch}
                onChange={(e) => setDhoSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDhos.map((dho) => (
              <div
                key={dho.district}
                className="bg-white p-5 rounded border border-slate-200 flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#0F2942] font-semibold">
                        District Health Officer
                      </span>
                      <h4 className="font-serif text-base font-semibold text-slate-900 mt-0.5">
                        {dho.district}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      State Cadre Officer
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="font-bold text-slate-900">
                      {dho.officerName}
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#0F2942] shrink-0" />
                      <span className="font-mono text-slate-900 font-semibold">{dho.phone}</span>
                      <span className="text-[11px]">· Hours: {dho.helplineHours}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-[#0F2942] shrink-0" />
                      <span className="font-mono text-slate-900 truncate">{dho.email}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#0F2942] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{dho.officeAddress}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="font-semibold text-slate-900 mb-1">Jurisdiction Hospitals:</div>
                    <div className="text-[11px] line-clamp-2">
                      {dho.jurisdictionHospitals.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Escalation SLA: 48 Hours
                  </span>
                  <a
                    href={`tel:${dho.phone.split(',')[0].trim()}`}
                    className="min-h-[36px] px-3 py-1 bg-[#0F2942] text-white text-xs font-semibold rounded hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 font-mono shadow-xs"
                  >
                    <Phone className="w-3 h-3 text-amber-300" />
                    <span>Call DHO Office</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Admin Forwarding Review Modal */}
      {selectedForForwarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 rounded border border-slate-200 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F2942] font-semibold">
                  GOVERNMENT REDRESSAL GATEWAY
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                  Forward Grievance #{selectedForForwarding.id}
                </h3>
                <p className="text-xs text-slate-600">
                  {selectedForForwarding.hospitalName} · {selectedForForwarding.category}
                </p>
              </div>

              <button
                onClick={() => setSelectedForForwarding(null)}
                aria-label="Close modal"
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forwardModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded">
                {forwardModalError}
              </div>
            )}

            <form onSubmit={handleSaveForwarding} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-900 mb-1">
                  Target Government Redressal Portal
                </label>
                <select
                  value={selectedPortal}
                  onChange={(e) => setSelectedPortal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden"
                >
                  <option value="Karnataka Janaspandana (IPGRS)">
                    Karnataka Janaspandana (IPGRS - ipgrs.karnataka.gov.in)
                  </option>
                  <option value="Central CPGRAMS (DARPG)">
                    Central CPGRAMS (DARPG - pgportal.gov.in)
                  </option>
                  <option value="District Health Officer Escalation">
                    District Health Officer (DHO Direct Disciplinary Escalation)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-1">
                  Official Portal Acknowledgement Number (Ack #)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IPGRS/2026/KA-MED-84912 or CPGRAMS/E/2026/04912"
                  value={ackNumberInput}
                  onChange={(e) => setAckNumberInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-[#0F2942]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-1">
                  Official Departmental Response Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Details received from the official government portal inquiry..."
                  value={responseDetailsInput}
                  onChange={(e) => setResponseDetailsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2942]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-1">
                  Forwarding Workflow Stage
                </label>
                <select
                  value={newForwardingStatus}
                  onChange={(e) => setNewForwardingStatus(e.target.value as ForwardingStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden font-mono"
                >
                  {forwardingWorkflowStages.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requirement: Mark as forwarded only after actual forwarding */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedManualForwarding}
                    onChange={(e) => setConfirmedManualForwarding(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#0F2942] focus:ring-[#0F2942]"
                  />
                  <div className="text-[11px] text-slate-800 leading-snug">
                    <strong className="block text-[#0F2942] font-semibold">
                      Certification of Verifiable Government Transmission:
                    </strong>
                    I certify that this complaint dossier has been manually transmitted to the authorized government portal ({selectedPortal}), and represents an authentic civic record.
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedForForwarding(null)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs font-mono rounded transition-colors shadow-xs"
                >
                  Certify Forwarding &amp; Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Downloadable / Printable Complaint Report Card */}
      {reportModalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-2xs overflow-y-auto animate-in fade-in">
          <div
            className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded border border-slate-200 my-auto space-y-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setReportModalComplaint(null)}
              aria-label="Close modal"
              className="no-print absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Formal Report Header */}
            <div className="border-b-2 border-[#0F2942] pb-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F2942] border border-[#0F2942]/30 px-2 py-0.5 rounded bg-slate-50 font-semibold">
                  PUBLIC HEALTHCARE GRIEVANCE DOSSIER
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Official Complaint Incident Report
                </h2>
                <div className="text-xs text-slate-600 font-mono">
                  NAMMA AROGYA · Independent Student Project
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Docket Ref</div>
                <div className="text-lg font-bold text-[#0F2942]">
                  {reportModalComplaint.id}
                </div>
              </div>
            </div>

            {/* Key Data Grid: Hospital, Category, Date, Forwarding */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Hospital Name</span>
                <span className="font-serif font-semibold text-slate-900 block truncate mt-0.5">
                  {reportModalComplaint.hospitalName}
                </span>
                <span className="text-slate-600 text-[11px] block truncate">
                  {reportModalComplaint.department}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Category &amp; Priority</span>
                <span className="font-semibold text-slate-900 block mt-0.5">
                  {reportModalComplaint.category}
                </span>
                <span className="text-[#0F2942] font-mono text-[11px] font-bold">
                  Priority: {reportModalComplaint.severity}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Filing Timestamp</span>
                <span className="font-mono text-slate-900 block mt-0.5">
                  {reportModalComplaint.submittedAt}
                </span>
                <span className="text-slate-600 text-[11px] block">
                  Complainant: {reportModalComplaint.citizenName}
                </span>
              </div>
            </div>

            {/* Incident Description */}
            <div className="space-y-1.5 text-xs">
              <span className="font-medium text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                Incident Narrative &amp; Complainant Grievance:
              </span>
              <p className="bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-900 leading-relaxed">
                {reportModalComplaint.description}
              </p>
            </div>

            {/* Photograph */}
            {reportModalComplaint.photoUrl ? (
              <div className="space-y-1.5 text-xs">
                <span className="font-medium text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                  Photographic Evidence Attached:
                </span>
                <div className="border border-slate-200 rounded overflow-hidden max-w-sm">
                  <img
                    src={reportModalComplaint.photoUrl}
                    alt="Complaint Evidence"
                    className="w-full h-44 object-cover"
                  />
                  <div className="bg-slate-50 px-3 py-1 text-[10px] text-slate-600 font-mono border-t border-slate-200">
                    Evidence File: verified_on_ground_proof.jpg
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 font-mono">
                No photographic evidence was uploaded with this initial submission.
              </div>
            )}

            {/* Official Acknowledgement Details */}
            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-[#0F2942]">
                  Government Redressal Record
                </span>
                <span className="font-mono text-[11px] text-[#0F2942] font-bold">
                  Stage: {reportModalComplaint.forwardingStatus || 'Received'}
                </span>
              </div>
              <div className="text-slate-900">
                <strong>Government Ack Ref #: </strong>
                <span className="font-mono text-[#0F2942] font-bold">
                  {reportModalComplaint.officialAckNumber || 'Pending Official Assignment'}
                </span>
              </div>
              {reportModalComplaint.forwardedToPortal && (
                <div className="text-slate-600">
                  <strong>Forwarded Channel: </strong>
                  <span>{reportModalComplaint.forwardedToPortal}</span>
                </div>
              )}
              {reportModalComplaint.officialResponseDetails && (
                <div className="text-slate-600 pt-1">
                  <strong className="text-slate-900">Departmental Action Summary: </strong>
                  <p className="mt-0.5 leading-relaxed">{reportModalComplaint.officialResponseDetails}</p>
                </div>
              )}
            </div>

            {/* Actions: Print as PDF / Close */}
            <div className="no-print pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Karnataka Public Healthcare Grievance Documentation Standard
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportModalComplaint(null)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={handlePrintReport}
                  className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs rounded flex items-center gap-1.5 font-mono transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
