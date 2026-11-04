import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintStatus } from '../types';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Send,
  BadgeCheck,
  Info
} from 'lucide-react';

export const TrackComplaintView: React.FC = () => {
  const { complaints, trackingQueryId, setTrackingQueryId, setActiveTab, language } = useApp();

  const [searchId, setSearchId] = useState<string>(
    trackingQueryId || (complaints[0] ? complaints[0].id : 'NA-KA-2026-81042')
  );

  useEffect(() => {
    if (trackingQueryId) {
      setSearchId(trackingQueryId);
    }
  }, [trackingQueryId]);

  const activeComplaint = complaints.find(
    (c) => c.id.trim().toUpperCase() === searchId.trim().toUpperCase()
  );

  const steps: ComplaintStatus[] = ['Submitted', 'Under Review', 'Action Taken', 'Resolved'];

  const getStepIndex = (status: ComplaintStatus) => steps.indexOf(status);

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 space-y-5 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold flex items-center gap-2">
            <span>PUBLIC HEALTHCARE GRIEVANCE TRACKING</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">DOCKET AUDIT</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {language === 'kn' ? 'ದೂರು ಪರಿಹಾರ ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ' : 'Track Grievance Docket Live'}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {language === 'kn'
              ? 'ದೂರಿನ ಅಧಿಕೃತ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಆಡಳಿತಾತ್ಮಕ ಪರಿಶೀಲನೆ, ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಅಧಿಕಾರಿಗಳ ಕ್ರಮ ಹಾಗೂ ಜನಸ್ಪಂದನ ರವಾನೆ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ.'
              : 'Enter your grievance docket reference ID to track internal recorded progress, facility review stages, and generated dossiers.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Reference ID (e.g. NA-KA-2026-81042)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm font-mono uppercase text-slate-900 focus:outline-hidden focus:border-[#0F2942] focus:bg-white transition-colors"
            />
            <button
              onClick={() => setTrackingQueryId(searchId)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs px-3.5 py-1.5 rounded transition-colors font-mono"
            >
              Search
            </button>
          </div>

          {/* Quick-test sample IDs */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-mono text-[11px] uppercase text-slate-500">Active Dockets:</span>
            {complaints.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSearchId(c.id);
                  setTrackingQueryId(c.id);
                }}
                className={`font-mono text-xs px-2.5 py-1 rounded border transition-colors ${
                  searchId.toUpperCase() === c.id.toUpperCase()
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#0F2942]'
                }`}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Container */}
      {!activeComplaint ? (
        <div className="bg-white p-12 text-center rounded border border-slate-200 shadow-xs">
          <div className="w-12 h-12 bg-slate-50 rounded border border-slate-200 flex items-center justify-center mx-auto text-slate-500 mb-3">
            <Search className="w-6 h-6 text-[#0F2942]" />
          </div>
          <h3 className="font-serif font-bold text-slate-900 text-base">Tracking Record Not Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
            Please verify the docket reference ID or select one of the active sample dockets above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
          {/* Top Summary Bar */}
          <div className="p-6 sm:p-8 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-mono uppercase text-[10px] text-slate-500">Grievance Docket:</span>
                  <span className="font-mono font-bold text-lg sm:text-xl text-[#0F2942]">
                    {activeComplaint.id}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {activeComplaint.category} – {activeComplaint.hospitalName}
                </h2>
                <div className="text-xs text-slate-600 mt-0.5 font-mono">
                  Registered: {activeComplaint.submittedAt} · Complainant: {activeComplaint.citizenName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-mono rounded border border-slate-200 bg-slate-50 text-slate-800">
                  Priority: {activeComplaint.severity}
                </span>

                <span className="px-3 py-1 text-xs font-mono font-semibold rounded bg-[#0F2942] text-white">
                  Status: {activeComplaint.status}
                </span>
              </div>
            </div>

            {/* Stepper Timeline Progress Bar */}
            <div className="py-8">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#0F2942] transition-all duration-300 -z-0"
                  style={{
                    width: `${(getStepIndex(activeComplaint.status) / (steps.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  {steps.map((st, idx) => {
                    const isCompleted = idx <= getStepIndex(activeComplaint.status);
                    const isCurrent = activeComplaint.status === st;

                    return (
                      <div key={st} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border transition-all font-mono ${
                            isCurrent
                              ? 'bg-[#0F2942] border-[#0F2942] text-white'
                              : isCompleted
                              ? 'bg-[#0F2942] border-[#0F2942] text-white'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] sm:text-xs font-mono font-medium mt-2 text-center max-w-[80px] sm:max-w-none ${
                            isCompleted ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Government Forwarding Status Card */}
            <div className="mt-2 mb-6">
              {activeComplaint.isActuallyForwarded ? (
                <div className="p-4 sm:p-5 bg-emerald-50/70 rounded border border-emerald-200 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>FORWARDED TO OFFICIAL AUTHORITY</span>
                    </div>
                    <span className="px-2.5 py-1 bg-white rounded border border-emerald-200 text-emerald-800 font-mono font-bold text-xs">
                      Official Ack: {activeComplaint.officialAckNumber || 'ACK-PENDING'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1 font-mono">
                    <div>
                      <span className="font-semibold text-slate-900">Forwarded Portal: </span>
                      <span>
                        {activeComplaint.forwardingAuthorityName || activeComplaint.forwardedToPortal || 'Karnataka Janaspandana (IPGRS)'}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Transmission Date: </span>
                      <span>{activeComplaint.forwardedAt || 'Recorded'}</span>
                    </div>
                  </div>

                  {activeComplaint.officialResponseDetails && (
                    <div className="p-2.5 bg-white rounded border border-slate-200 text-xs text-slate-900">
                      <span className="font-semibold block text-[11px] text-[#0F2942] font-mono uppercase">
                        Official Response from Authority:
                      </span>
                      <p className="mt-0.5 leading-relaxed">{activeComplaint.officialResponseDetails}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 sm:p-5 bg-amber-50/60 rounded border border-amber-200 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>STORED IN CITIZEN REGISTRY · NOT YET SENT TO GOVERNMENT</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white rounded border border-amber-200 text-slate-700 text-[10px] font-mono">
                      Demonstration Record
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    This grievance is securely saved in your browser&apos;s session database. Because this is an independent student platform, it has <strong>NOT been automatically transmitted to the Karnataka Government</strong> without authorized integration. Use the Government Communication Centre to generate an official PDF complaint dossier for submission to Janaspandana (IPGRS).
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('gov-comm')}
                      className="px-3 py-1.5 bg-[#0F2942] text-white hover:bg-[#1E3A8A] font-medium text-[11px] rounded flex items-center gap-1.5 transition-colors font-mono"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                      <span>Open Government Communication Centre</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Academic Transparency Standard
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Narrative & Location */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded border border-slate-200 space-y-2.5 text-xs text-slate-900">
              <div>
                <span className="font-semibold text-slate-900">Hospital Location / Ward: </span>
                <span className="text-slate-600">{activeComplaint.department}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">Complainant Statement: </span>
                <p className="text-slate-700 leading-relaxed mt-1">{activeComplaint.description}</p>
              </div>

              {activeComplaint.photoUrl && (
                <div className="pt-2">
                  <span className="font-semibold text-slate-900 block mb-1">Attached Photographic Evidence:</span>
                  <img
                    src={activeComplaint.photoUrl}
                    alt="Evidence"
                    className="w-48 h-32 object-cover rounded border border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Detailed Administrative Action Log */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-serif font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F2942]" />
                Administrative Action Log
              </h3>

              <div className="space-y-3">
                {activeComplaint.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#0F2942] mt-1.5 shrink-0" />
                    <div className="flex-1 bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-900">{event.step}</span>
                        <span className="font-mono text-[10px] text-slate-500">{event.timestamp}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{event.note}</p>
                      {event.officer && (
                        <div className="text-[11px] font-medium text-[#0F2942] mt-1 flex items-center gap-1 font-mono">
                          <ShieldCheck className="w-3 h-3 text-[#0F2942]" />
                          <span>Action Officer: {event.officer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Redressal Resolution Note */}
            {activeComplaint.status === 'Resolved' && activeComplaint.resolutionNote && (
              <div className="mt-6 p-4 bg-emerald-50/70 rounded border border-emerald-200 text-xs space-y-1.5">
                <div className="font-serif font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official Redressal Resolution</span>
                </div>
                <p className="text-slate-900 leading-relaxed">{activeComplaint.resolutionNote}</p>
                {activeComplaint.assignedOfficer && (
                  <div className="text-[11px] font-mono text-slate-600 pt-1">
                    Certified by: {activeComplaint.assignedOfficer}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
