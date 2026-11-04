import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bed,
  Pill,
  Ambulance,
  Wrench,
  Info,
  ChevronRight,
  Phone
} from 'lucide-react';

export const HospitalFacilitiesView: React.FC = () => {
  const { hospitals, medicines, setSelectedHospitalDetail, language } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'beds' | 'medicines' | 'ambulances' | 'equipment'>('beds');
  const [medicineFilter, setMedicineFilter] = useState<'All' | 'Critical Shortage' | 'Moderate' | 'Adequate'>('All');
  const [hospitalFilter, setHospitalFilter] = useState<string>('All');

  const filteredMedicines = medicines.filter((m) => {
    const matchesLevel = medicineFilter === 'All' || m.stockLevel === medicineFilter;
    const matchesHosp = hospitalFilter === 'All' || m.hospitalName === hospitalFilter;
    return matchesLevel && matchesHosp;
  });

  const hospitalNames = ['All', ...Array.from(new Set(hospitals.map((h) => h.name)))];

  const equipmentList = [
    { name: '128-Slice Whole Body CT Scanner', hospital: 'Victoria Hospital BMCRI Campus', dept: 'Radiology Block A', status: 'Operational', uptime: '99.4%', lastServiced: 'Oct 28, 2026', custodian: 'Dept. of Radiodiagnosis' },
    { name: '3.0 Tesla Advanced MRI Scanner', hospital: 'Mysore Medical College & K.R. Hospital', dept: 'Super Specialty Wing', status: 'Operational', uptime: '98.8%', lastServiced: 'Oct 15, 2026', custodian: 'Central Imaging Services' },
    { name: 'Digital Radiography (X-Ray Unit 1)', hospital: 'Govt Wenlock District Hospital Mangaluru', dept: 'Emergency Casualty', status: 'Operational', uptime: '97.2%', lastServiced: 'Nov 01, 2026', custodian: 'Trauma & Emergency Care' },
    { name: 'Digital Radiography (X-Ray Unit 2)', hospital: 'Karnataka Institute of Medical Sciences KIMS Hubballi', dept: 'Emergency Wing', status: 'Calibration Required', uptime: '74.1%', lastServiced: 'Nov 02, 2026 (Part Ordered)', custodian: 'Biomedical Engineering Wing' },
    { name: 'Automated Hemodialysis Unit (12 Beds)', hospital: 'Gulbarga Institute of Medical Sciences GIMS Kalaburagi', dept: 'Nephrology Ward', status: 'Operational', uptime: '99.9%', lastServiced: 'Oct 24, 2026', custodian: 'Nephrology Services' },
    { name: 'Level III NICU Infant Incubators (24 Units)', hospital: 'Vani Vilas Women & Children Hospital Bengaluru', dept: 'Neonatal ICU', status: 'Operational', uptime: '100%', lastServiced: 'Oct 30, 2026', custodian: 'Neonatal Care Unit' },
    { name: 'Color Doppler Ultrasound Scanner', hospital: 'District Civil Hospital Hassan', dept: 'Diagnostic Ultrasound', status: 'Operational', uptime: '96.5%', lastServiced: 'Oct 19, 2026', custodian: 'Sonography Wing' },
    { name: 'Automated Biochemistry Blood Analyzer', hospital: 'General Hospital Sagar (Shivamogga)', dept: 'Central Pathology', status: 'Routine Service Due', uptime: '88.0%', lastServiced: 'Scheduled Nov 08', custodian: 'Clinical Pathology Laboratory' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Editorial Header */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0F2942] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#0F2942] rounded-full"></span>
            <span>PUBLIC FACILITY REGISTRY · STATE INFRASTRUCTURE AUDIT</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
            {language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ಸೌಲಭ್ಯಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲ ದಾಸ್ತಾನು' : 'Hospital Facilities & Resource Inventory'}
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {language === 'kn'
              ? 'ವಾರ್ಡ್ ಬೆಡ್ ಲಭ್ಯತೆ, ಪ್ರಧಾನಮಂತ್ರಿ ಭಾರತೀಯ ಜನೌಷಧಿ ಅಗತ್ಯ ಔಷಧಿ ದಾಸ್ತಾನು, ಆರೋಗ್ಯ ಕವಚ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಬಯೋಮೆಡಿಕಲ್ ಉಪಕರಣಗಳ ಅಧಿಕೃತ ಪರಿಶೀಲನೆ.'
              : 'Public monitoring of critical healthcare infrastructure: inpatient bed availability, Jan Aushadhi essential generic medicines formulary, Arogya Kavacha 108 emergency trauma fleet, and certified biomedical machinery.'}
          </p>
        </div>

        {/* Data Source Notice */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-[#0F2942]">Verification &amp; HMIS Provenance:</span> Inpatient bed occupancies and ambulance rosters reflect Karnataka Health Management Information System (HMIS) feeds. Pharmacy stocks reflect the state Jan Aushadhi buffer count reconciled within the last 24 hours.
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
          {[
            { id: 'beds', label: 'Inpatient Beds', labelKn: 'ಒಳರೋಗಿ ಹಾಸಿಗೆಗಳು', icon: Bed },
            { id: 'medicines', label: 'Essential Medicines', labelKn: 'ಅಗತ್ಯ ಔಷಧಿಗಳು', icon: Pill },
            { id: 'ambulances', label: 'Emergency 108 Fleet', labelKn: '108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಪಡೆ', icon: Ambulance },
            { id: 'equipment', label: 'Diagnostic Equipment', labelKn: 'ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಉಪಕರಣಗಳು', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`min-h-[42px] px-4 py-2 text-xs font-medium rounded flex items-center gap-2 transition-colors border ${
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

      {/* Subtab 1: Bed Availability Matrix */}
      {activeSubTab === 'beds' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs px-1 text-slate-600 gap-1">
            <span className="font-semibold text-slate-900">
              Inpatient Bed Occupancy Matrix across {hospitals.length} Monitored Civic Hospitals
            </span>
            <span className="font-mono text-[11px] text-slate-500">Karnataka HMIS Telemetry · 15-min intervals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((h) => {
              const icuAvail = h.bedStats.icu.total - h.bedStats.icu.occupied;
              const oxyAvail = h.bedStats.oxygen.total - h.bedStats.oxygen.occupied;
              const genAvail = h.bedStats.general.total - h.bedStats.general.occupied;
              const pedAvail = h.bedStats.pediatric.total - h.bedStats.pediatric.occupied;

              return (
                <div
                  key={h.id}
                  className="bg-white p-5 rounded border border-slate-200 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        {h.type} · {h.district}
                      </div>
                      <h3 className="font-serif text-base font-semibold text-slate-900 mt-1 leading-snug">
                        {h.name}
                      </h3>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Emergency Contact: <span className="font-mono text-rose-700 font-semibold">{h.emergencyHelpline}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase font-semibold text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50">
                        {h.isVerifiedReal ? 'Verified Real' : 'Demonstration Record'}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        Updated {h.lastUpdated}
                      </div>
                    </div>
                  </div>

                  {/* Bed Breakdown Gauges */}
                  <div className="space-y-3 text-xs">
                    {/* ICU */}
                    <div>
                      <div className="flex justify-between text-slate-900 mb-1">
                        <span className="font-medium">ICU &amp; Critical Care</span>
                        <span className="font-mono tabular-nums">
                          <strong className={icuAvail > 2 ? 'text-emerald-700' : 'text-rose-700'}>{icuAvail}</strong>
                          <span className="text-slate-500"> / {h.bedStats.icu.total} total</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${icuAvail > 2 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                          style={{
                            width: `${Math.min(100, Math.round((h.bedStats.icu.occupied / h.bedStats.icu.total) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Oxygen */}
                    <div>
                      <div className="flex justify-between text-slate-900 mb-1">
                        <span className="font-medium">High-Flow Oxygen Beds</span>
                        <span className="font-mono tabular-nums">
                          <strong className="text-slate-900">{oxyAvail}</strong>
                          <span className="text-slate-500"> / {h.bedStats.oxygen.total} total</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-slate-600 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((h.bedStats.oxygen.occupied / h.bedStats.oxygen.total) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* General Ward */}
                    <div>
                      <div className="flex justify-between text-slate-900 mb-1">
                        <span className="font-medium">General Inpatient Ward</span>
                        <span className="font-mono tabular-nums">
                          <strong className="text-slate-900">{genAvail}</strong>
                          <span className="text-slate-500"> / {h.bedStats.general.total} total</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#0F2942] rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((h.bedStats.general.occupied / h.bedStats.general.total) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Pediatric */}
                    <div>
                      <div className="flex justify-between text-slate-900 mb-1">
                        <span className="font-medium">Pediatric &amp; Neonatal Beds</span>
                        <span className="font-mono tabular-nums">
                          <strong className="text-slate-900">{pedAvail}</strong>
                          <span className="text-slate-500"> / {h.bedStats.pediatric.total} total</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((h.bedStats.pediatric.occupied / h.bedStats.pediatric.total) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      Sanitation Index: <strong className="text-slate-900 font-mono">{h.sanitationRating} / 5.0</strong>
                    </span>
                    <button
                      onClick={() => setSelectedHospitalDetail(h)}
                      className="min-h-[40px] px-2 font-medium text-[#0F2942] hover:underline flex items-center gap-1 text-xs"
                    >
                      <span>Full Hospital Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Medicine Stock Registry */}
      {activeSubTab === 'medicines' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-900 font-mono text-[11px] uppercase">Inventory Status:</span>
              {(['All', 'Adequate', 'Moderate', 'Critical Shortage'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setMedicineFilter(lvl)}
                  className={`min-h-[36px] px-3 py-1 font-medium rounded transition-colors border font-mono text-xs ${
                    medicineFilter === lvl
                      ? lvl === 'Critical Shortage'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : lvl === 'Moderate'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 font-mono text-[11px] uppercase">Hospital:</span>
              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                aria-label="Filter medicine stock by hospital"
                className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 font-medium text-slate-900 focus:outline-hidden"
              >
                {hospitalNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((m) => {
              const isCritical = m.stockLevel === 'Critical Shortage';
              const isModerate = m.stockLevel === 'Moderate';

              return (
                <div
                  key={m.id}
                  className="bg-white p-4 rounded border border-slate-200 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] uppercase font-mono text-slate-500">
                        {m.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded border ${
                          isCritical
                            ? 'border-rose-300 text-rose-800 bg-rose-50'
                            : isModerate
                            ? 'border-amber-300 text-amber-800 bg-amber-50'
                            : 'border-emerald-300 text-emerald-800 bg-emerald-50'
                        }`}
                      >
                        {m.stockLevel}
                      </span>
                    </div>

                    <h3 className="font-serif font-semibold text-sm text-slate-900 leading-snug">{m.name}</h3>
                    <div className="text-xs text-slate-600 mt-0.5">{m.hospitalName}</div>

                    <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Current Stock:</span>
                        <span className="text-slate-900 font-bold">
                          {m.unitsAvailable.toLocaleString()} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Buffer Level:</span>
                        <span className="text-slate-500">
                          {m.minimumRequired.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500">Supply Runway:</span>
                        <span
                          className={`font-bold ${
                            m.daysOfSupplyLeft <= 7 ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {m.daysOfSupplyLeft} days remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                    <span>Audited: {m.lastAudited}</span>
                    <span className="font-semibold text-slate-900">Jan Aushadhi Buffer</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Ambulance Fleet Status */}
      {activeSubTab === 'ambulances' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Arogya Kavacha 108 Fleet</div>
              <div className="text-3xl font-mono font-bold text-slate-900 mt-1">
                {hospitals.reduce((acc, h) => acc + h.ambulanceCount.total, 0)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Basic Life Support &amp; Advanced Cardiac Care Units</div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Stationed on Standby</div>
              <div className="text-3xl font-mono font-bold text-emerald-700 mt-1">
                {hospitals.reduce((acc, h) => acc + h.ambulanceCount.ready, 0)}
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1">Immediate dispatch readiness (ETA 8–12 min)</div>
            </div>

            <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
              <div className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">Active Dispatches</div>
              <div className="text-3xl font-mono font-bold text-amber-600 mt-1">
                {hospitals.reduce((acc, h) => acc + (h.ambulanceCount.total - h.ambulanceCount.ready), 0)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Under 108 Emergency GPS live coordination</div>
            </div>
          </div>

          {/* Hospital-wise ambulances table */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-xs">
            <h3 className="font-serif text-base font-semibold text-slate-900 mb-4">
              Hospital Fleet Allocation &amp; Emergency Dispatch Roster
            </h3>
            <div className="divide-y divide-slate-100">
              {hospitals.map((h) => (
                <div
                  key={h.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-serif font-semibold text-sm text-slate-900">{h.name}</div>
                    <div className="text-slate-600 mt-0.5">{h.district} · Emergency Line: <span className="font-mono text-rose-700 font-bold">{h.emergencyHelpline}</span></div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-emerald-700">
                        {h.ambulanceCount.ready} Ready
                      </span>
                      <span className="text-slate-500"> / {h.ambulanceCount.total} total</span>
                    </div>

                    <a
                      href={`tel:${h.emergencyHelpline.split('/')[0].trim()}`}
                      className="min-h-[40px] px-3.5 py-2 bg-[#0F2942] text-white text-xs font-medium rounded hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 font-mono shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      <span>Dispatch Desk</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Diagnostic Equipment Health */}
      {activeSubTab === 'equipment' && (
        <div className="bg-white p-6 rounded border border-slate-200 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-slate-900">
                Biomedical Diagnostic Equipment &amp; Calibration Registry
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Statutory audit certified by District Biomedical Engineering Cells
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">Audited monthly</span>
          </div>

          <div className="divide-y divide-slate-100">
            {equipmentList.map((eq, i) => (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-serif font-semibold text-sm text-slate-900">{eq.name}</div>
                  <div className="text-slate-600 mt-0.5">
                    {eq.hospital} · {eq.dept} · <span className="text-slate-900 font-medium">{eq.custodian}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        eq.status === 'Operational'
                          ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                          : eq.status === 'Calibration Required'
                          ? 'border-rose-300 text-rose-800 bg-rose-50 font-bold'
                          : 'border-amber-300 text-amber-800 bg-amber-50'
                      }`}
                    >
                      {eq.status}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Uptime: {eq.uptime}</div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono hidden sm:block min-w-[130px] text-right">
                    {eq.lastServiced}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
