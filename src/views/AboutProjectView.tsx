import React from 'react';
import {
  Printer,
  ShieldCheck,
  Building2,
  Users,
  HeartPulse,
  Target,
  CheckCircle2,
  Award,
  Layers,
  PhoneCall,
  ExternalLink,
  Info
} from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Interactive Screen Header */}
      <div className="no-print bg-white p-6 sm:p-8 rounded border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0F2942] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#0F2942] rounded-full"></span>
            <span>PROJECT DISCLOSURE · INDEPENDENT ACADEMIC INITIATIVE</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
            About NAMMA AROGYA (ನಮ್ಮ ಆರೋಗ್ಯ)
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Public healthcare transparency briefing covering hospital capacity monitoring, verified doctor OPD schedules, and citizen grievance redressal in Karnataka.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="min-h-[44px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs sm:text-sm rounded flex items-center justify-center gap-2 transition-colors shrink-0 font-mono shadow-xs"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Save / Print as PDF</span>
        </button>
      </div>

      {/* Mandatory Statutory Disclaimer Card */}
      <div className="bg-amber-50 border-l-4 border-l-[#0F2942] border border-amber-200 rounded p-5 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Info className="w-4 h-4 text-[#0F2942]" />
          <span>Independent Student Project Disclosure</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Namma Arogya is an independent student-developed project and is not an official government service.</strong> It does not represent or act on behalf of the Government of Karnataka or the Ministry of Health and Family Welfare. No government seals or logos are used, and no claims of automated background government submission are made.
        </p>
      </div>

      {/* DOCUMENT WRAPPER (Styled for Screen & A4 Print) */}
      <div className="bg-white p-6 sm:p-12 rounded border border-slate-200 print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto space-y-8 text-slate-900 shadow-xs">
        {/* Document Formal Masthead */}
        <div className="border-b-2 border-[#0F2942] pb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#0F2942] font-semibold">
              PUBLIC HEALTHCARE INFORMATION SYSTEM · KARNATAKA
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              NAMMA AROGYA
            </h1>
            <h2 className="text-sm sm:text-base font-medium text-slate-600 mt-0.5">
              Public Healthcare. Citizen Voice. Better Accountability.
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Ref: NA-KA-2026-PROJECT-DOSSIER · Academic Transparency
            </div>
          </div>

          <div className="text-right text-xs text-slate-600 font-mono">
            <div className="font-bold text-slate-900">Namma Arogya Initiative</div>
            <div>Karnataka Healthcare Information Desk</div>
            <div className="text-[11px] text-[#0F2942] mt-0.5 font-semibold">Grievance Support Gateway</div>
          </div>
        </div>

        {/* 1. Problem Statement */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#0F2942]">
            <Target className="w-4 h-4 text-[#0F2942]" />
            <h2 className="font-serif text-base font-semibold text-slate-900 uppercase tracking-wider text-sm">
              1. The Healthcare Problem Statement
            </h2>
          </div>
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs sm:text-sm leading-relaxed space-y-2 text-slate-800">
            <p>
              Across Karnataka&apos;s 31 districts, government teaching hospitals (such as Victoria Hospital in Bengaluru, MMC &amp; K.R. Hospital in Mysuru, Wenlock Hospital in Mangaluru) and taluk health centers provide crucial medical care. Common challenges citizens face include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2 text-xs">
              <li>
                <strong className="text-slate-900">Emergency Bed &amp; Oxygen Information Gaps:</strong> Critical patients frequently travel across districts without confirmed ICU or oxygen bed availability, risking critical delays.
              </li>
              <li>
                <strong className="text-slate-900">Unclear OPD Specialist Schedules:</strong> Patients often arrive at civil hospitals without knowing whether the consulting specialist is on duty.
              </li>
              <li>
                <strong className="text-slate-900">Grievance Follow-Up Bottlenecks:</strong> On-ground complaints about medicine shortages or sanitation are often undocumented or lack structured reference numbers.
              </li>
              <li>
                <strong className="text-slate-900">Official Portal Navigation:</strong> Many citizens find it difficult to locate official portals like ORS (ors.gov.in) and Janaspandana (ipgrs.karnataka.gov.in).
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Proposed Solution */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#0F2942]">
            <HeartPulse className="w-4 h-4 text-[#0F2942]" />
            <h2 className="font-serif text-base font-semibold text-slate-900 uppercase tracking-wider text-sm">
              2. Proposed Solution: NAMMA AROGYA Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">NAMMA AROGYA</strong> provides a clean, mobile-first public service portal bridging citizens with verified public hospital listings, doctor OPD rosters, and structured grievance dossiers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 text-xs">
              <div className="font-serif font-bold text-sm text-[#0F2942]">Citizens</div>
              <div className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Discover hospitals across Karnataka, check verified doctor rosters, book on official ORS, and report issues with photographic evidence.
              </div>
            </div>
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 text-xs">
              <div className="font-serif font-bold text-sm text-[#0F2942]">Hospitals</div>
              <div className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Publish verified OPD schedules, monitor bed vacancies, track Jan Aushadhi generic supplies, and maintain 108 ambulance readiness.
              </div>
            </div>
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 text-xs">
              <div className="font-serif font-bold text-sm text-[#0F2942]">Administrators</div>
              <div className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                Review logged grievances, compile official dossiers, coordinate with District Health Officers, and update facility data.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Objectives & System Capabilities */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#0F2942]">
            <CheckCircle2 className="w-4 h-4 text-[#0F2942]" />
            <h2 className="font-serif text-base font-semibold text-slate-900 uppercase tracking-wider text-sm">
              3. Core Objectives &amp; System Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-1">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942]" />
                <span className="font-semibold">Hospital Directory &amp; Bed Telemetry</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Directory of civil, general, and primary health centers with ICU, Oxygen, and General bed vacancies.
              </p>
            </div>

            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-1">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942]" />
                <span className="font-semibold">Official ORS.gov.in Direct Gateway</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct links to NIC Online Registration System (ors.gov.in) with no simulated tokens.
              </p>
            </div>

            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-1">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942]" />
                <span className="font-semibold">Karnataka Janaspandana Liaison</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Generate formatted complaint dossiers with reference IDs for submission to ipgrs.karnataka.gov.in.
              </p>
            </div>

            <div className="p-3.5 rounded border border-slate-200 bg-white space-y-1">
              <div className="font-medium text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F2942]" />
                <span className="font-semibold">Verified Medical Rosters</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Physicians with Karnataka Medical Council (KMC) registration numbers, OPD days, and chamber rooms.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Official Government Links & Helplines */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <div className="font-serif font-bold text-sm text-slate-900">Official Government Portals &amp; Helplines:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="https://ipgrs.karnataka.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded border border-slate-200 hover:border-[#0F2942] bg-slate-50 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900">Karnataka Janaspandana (IPGRS)</div>
                <div className="text-[11px] text-slate-500 font-mono">ipgrs.karnataka.gov.in</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0F2942]" />
            </a>

            <a
              href="https://pgportal.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded border border-slate-200 hover:border-[#0F2942] bg-slate-50 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900">CPGRAMS (Government of India)</div>
                <div className="text-[11px] text-slate-500 font-mono">pgportal.gov.in</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0F2942]" />
            </a>

            <a
              href="https://ors.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded border border-slate-200 hover:border-[#0F2942] bg-slate-50 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900">National ORS Booking Portal</div>
                <div className="text-[11px] text-slate-500 font-mono">ors.gov.in</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0F2942]" />
            </a>

            <a
              href="https://karunadu.karnataka.gov.in/hfw/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded border border-slate-200 hover:border-[#0F2942] bg-slate-50 flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-semibold text-slate-900">Karnataka Health &amp; Family Welfare</div>
                <div className="text-[11px] text-slate-500 font-mono">karunadu.karnataka.gov.in/hfw</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0F2942]" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
