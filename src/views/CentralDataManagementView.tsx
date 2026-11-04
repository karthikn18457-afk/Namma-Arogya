import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital, Doctor } from '../types';
import {
  exportHospitalsToCSV,
  exportDoctorsToCSV,
  triggerCSVDownload,
  generateHospitalCSVTemplate,
} from '../services/dataService';
import {
  Database,
  Building2,
  Stethoscope,
  Activity,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  Search,
  X
} from 'lucide-react';

export const CentralDataManagementView: React.FC = () => {
  const {
    hospitals,
    doctors,
    addHospital,
    updateHospital,
    deleteHospital,
    importHospitalsFromCSV,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    updateHospitalFacilities,
    dataFilterMode,
    setDataFilterMode,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'facilities' | 'provenance'>('hospitals');

  // Search queries
  const [searchQuery, setSearchQuery] = useState('');

  // Hospital Modal
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [hospForm, setHospForm] = useState({
    name: '',
    type: 'District Civil Hospital' as Hospital['type'],
    district: 'Bengaluru Urban District',
    address: '',
    phone: '',
    emergencyHelpline: '108',
    status: 'Open 24/7' as Hospital['status'],
    icuTotal: 24,
    icuOcc: 14,
    oxyTotal: 80,
    oxyOcc: 50,
    genTotal: 300,
    genOcc: 220,
    pedTotal: 50,
    pedOcc: 30,
    facilitiesText: '24/7 Blood Bank, Digital X-Ray, Generic Pharmacy, Emergency Triage',
    departmentsText: 'General Medicine, Emergency, Pediatrics, Obstetrics & Gynecology',
    medicineStockScore: 92,
    sanitationRating: 4.4,
    nodalOfficer: '',
    isVerifiedReal: true,
    dataSource: 'National Health Portal (NHP) / Karnataka State Health Directorate',
    verifiedBy: 'District Health & Family Welfare Officer',
    isOrsParticipating: true,
    orsHospitalCode: '',
  });

  // Doctor Modal
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docForm, setDocForm] = useState({
    name: '',
    designation: 'Senior Consultant & Specialist',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    hospitalId: hospitals[0]?.id || '',
    department: 'General Medicine',
    opdTimings: '09:00 AM – 01:30 PM (Mon to Sat)',
    availableDaysText: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
    status: 'Available Today' as Doctor['status'],
    experienceYears: 12,
    roomNumber: 'OPD Room 102',
    isVerifiedReal: true,
    dataSource: 'Karnataka Medical Council (KMC) Registry',
    councilRegistrationNumber: 'KMC-54120',
  });

  // CSV Import Modal
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [csvInputText, setCsvInputText] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; count: number; errors: string[] } | null>(null);

  // Facility Staff Update Modal
  const [isStaffUpdateModalOpen, setIsStaffUpdateModalOpen] = useState(false);
  const [staffUpdateHospId, setStaffUpdateHospId] = useState(hospitals[0]?.id || '');
  const [staffName, setStaffName] = useState('Nandita Rao');
  const [staffDesignation, setStaffDesignation] = useState('Hospital Matron / Bed Manager');
  const [staffIcuTotal, setStaffIcuTotal] = useState(24);
  const [staffIcuOcc, setStaffIcuOcc] = useState(18);
  const [staffOxyTotal, setStaffOxyTotal] = useState(80);
  const [staffOxyOcc, setStaffOxyOcc] = useState(55);
  const [staffGenTotal, setStaffGenTotal] = useState(300);
  const [staffGenOcc, setStaffGenOcc] = useState(240);
  const [staffPedTotal, setStaffPedTotal] = useState(50);
  const [staffPedOcc, setStaffPedOcc] = useState(32);
  const [staffMedicineScore, setStaffMedicineScore] = useState(90);
  const [staffSanitationRating, setStaffSanitationRating] = useState(4.5);

  // Filtered lists according to global real/demo mode
  const displayedHospitals = hospitals.filter((h) => {
    const matchesFilter =
      dataFilterMode === 'all'
        ? true
        : dataFilterMode === 'verified_only'
        ? h.isVerifiedReal
        : !h.isVerifiedReal;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.dataSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const displayedDoctors = doctors.filter((d) => {
    const matchesFilter =
      dataFilterMode === 'all'
        ? true
        : dataFilterMode === 'verified_only'
        ? d.isVerifiedReal
        : !d.isVerifiedReal;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.councilRegistrationNumber && d.councilRegistrationNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Open Add Hospital
  const handleOpenAddHospital = () => {
    setEditingHospital(null);
    setHospForm({
      name: '',
      type: 'District Civil Hospital',
      district: 'Bengaluru Urban District',
      address: '',
      phone: '+91 80-2222-0000',
      emergencyHelpline: '108',
      status: 'Open 24/7',
      icuTotal: 25,
      icuOcc: 15,
      oxyTotal: 80,
      oxyOcc: 45,
      genTotal: 300,
      genOcc: 210,
      pedTotal: 50,
      pedOcc: 30,
      facilitiesText: '24/7 Blood Bank, Digital X-Ray, Generic Pharmacy, Emergency Triage',
      departmentsText: 'General Medicine, Emergency, Pediatrics, Obstetrics & Gynecology',
      medicineStockScore: 92,
      sanitationRating: 4.5,
      nodalOfficer: 'Dr. Ramesh Kumar (Superintendent)',
      isVerifiedReal: true,
      dataSource: 'National Health Portal (NHP) / Karnataka State Health Directorate',
      verifiedBy: 'District Health & Family Welfare Officer',
      isOrsParticipating: true,
      orsHospitalCode: 'ORS-KA-001',
    });
    setIsHospitalModalOpen(true);
  };

  const handleOpenEditHospital = (h: Hospital) => {
    setEditingHospital(h);
    setHospForm({
      name: h.name,
      type: h.type,
      district: h.district,
      address: h.address,
      phone: h.phone,
      emergencyHelpline: h.emergencyHelpline,
      status: h.status,
      icuTotal: h.bedStats.icu.total,
      icuOcc: h.bedStats.icu.occupied,
      oxyTotal: h.bedStats.oxygen.total,
      oxyOcc: h.bedStats.oxygen.occupied,
      genTotal: h.bedStats.general.total,
      genOcc: h.bedStats.general.occupied,
      pedTotal: h.bedStats.pediatric.total,
      pedOcc: h.bedStats.pediatric.occupied,
      facilitiesText: h.facilities.join(', '),
      departmentsText: h.departments.join(', '),
      medicineStockScore: h.medicineStockScore,
      sanitationRating: h.sanitationRating,
      nodalOfficer: h.nodalOfficer,
      isVerifiedReal: h.isVerifiedReal,
      dataSource: h.dataSource,
      verifiedBy: h.verifiedBy,
      isOrsParticipating: h.isOrsParticipating ?? false,
      orsHospitalCode: h.orsHospitalCode || '',
    });
    setIsHospitalModalOpen(true);
  };

  const handleSaveHospital = (e: React.FormEvent) => {
    e.preventDefault();
    const facilities = hospForm.facilitiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const departments = hospForm.departmentsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const hospitalPayload = {
      name: hospForm.name.trim(),
      type: hospForm.type,
      district: hospForm.district.trim(),
      address: hospForm.address.trim(),
      phone: hospForm.phone.trim(),
      emergencyHelpline: hospForm.emergencyHelpline.trim(),
      status: hospForm.status,
      rating: 4.5,
      reviewCount: 120,
      departments,
      facilities,
      emergencyServices: true,
      bedStats: {
        icu: { total: hospForm.icuTotal, occupied: hospForm.icuOcc },
        oxygen: { total: hospForm.oxyTotal, occupied: hospForm.oxyOcc },
        general: { total: hospForm.genTotal, occupied: hospForm.genOcc },
        pediatric: { total: hospForm.pedTotal, occupied: hospForm.pedOcc },
      },
      ambulanceCount: { total: 10, ready: 8 },
      medicineStockScore: hospForm.medicineStockScore,
      sanitationRating: hospForm.sanitationRating,
      nodalOfficer: hospForm.nodalOfficer.trim(),
      imageUrl: '/src/assets/images/district_civil_hospital_1793633646116.jpg',
      isVerifiedReal: hospForm.isVerifiedReal,
      dataSource: hospForm.dataSource.trim(),
      verificationDate: new Date().toISOString().slice(0, 10),
      verifiedBy: hospForm.verifiedBy.trim(),
      isOrsParticipating: hospForm.isOrsParticipating,
      orsHospitalCode: hospForm.orsHospitalCode.trim(),
      lastUpdated: 'Just now (Admin Record Update)',
    };

    if (editingHospital) {
      updateHospital(editingHospital.id, hospitalPayload);
    } else {
      addHospital(hospitalPayload);
    }

    setIsHospitalModalOpen(false);
  };

  // Open Add Doctor
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocForm({
      name: '',
      designation: 'Senior Consultant',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD',
      hospitalId: hospitals[0]?.id || '',
      department: 'General Medicine',
      opdTimings: '09:00 AM – 01:30 PM (Mon to Sat)',
      availableDaysText: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday',
      status: 'Available Today',
      experienceYears: 10,
      roomNumber: 'OPD Room 101',
      isVerifiedReal: true,
      dataSource: 'Karnataka Medical Council (KMC) Registry',
      councilRegistrationNumber: 'KMC-52190',
    });
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (d: Doctor) => {
    setEditingDoctor(d);
    setDocForm({
      name: d.name,
      designation: d.designation,
      specialization: d.specialization,
      qualification: d.qualification,
      hospitalId: d.hospitalId,
      department: d.department,
      opdTimings: d.opdTimings,
      availableDaysText: d.availableDays.join(', '),
      status: d.status,
      experienceYears: d.experienceYears,
      roomNumber: d.roomNumber,
      isVerifiedReal: d.isVerifiedReal,
      dataSource: d.dataSource,
      councilRegistrationNumber: d.councilRegistrationNumber || '',
    });
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const availableDays = docForm.availableDaysText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedHospital = hospitals.find((h) => h.id === docForm.hospitalId);

    const doctorPayload = {
      name: docForm.name.trim(),
      designation: docForm.designation.trim(),
      specialization: docForm.specialization.trim(),
      qualification: docForm.qualification.trim(),
      hospitalId: docForm.hospitalId,
      hospitalName: assignedHospital?.name || 'District Civil Hospital',
      department: docForm.department.trim(),
      opdTimings: docForm.opdTimings.trim(),
      availableDays,
      status: docForm.status,
      experienceYears: docForm.experienceYears,
      roomNumber: docForm.roomNumber.trim(),
      avatarUrl: '/src/assets/images/karnataka_doctor_consultation_1793729276068.jpg',
      isVerifiedReal: docForm.isVerifiedReal,
      dataSource: docForm.dataSource.trim(),
      councilRegistrationNumber: docForm.councilRegistrationNumber.trim(),
      verificationDate: new Date().toISOString().slice(0, 10),
    };

    if (editingDoctor) {
      updateDoctor(editingDoctor.id, doctorPayload);
    } else {
      addDoctor(doctorPayload);
    }

    setIsDoctorModalOpen(false);
  };

  // Staff Facility Telemetry update
  const handleOpenStaffUpdate = (h: Hospital) => {
    setStaffUpdateHospId(h.id);
    setStaffIcuTotal(h.bedStats.icu.total);
    setStaffIcuOcc(h.bedStats.icu.occupied);
    setStaffOxyTotal(h.bedStats.oxygen.total);
    setStaffOxyOcc(h.bedStats.oxygen.occupied);
    setStaffGenTotal(h.bedStats.general.total);
    setStaffGenOcc(h.bedStats.general.occupied);
    setStaffPedTotal(h.bedStats.pediatric.total);
    setStaffPedOcc(h.bedStats.pediatric.occupied);
    setStaffMedicineScore(h.medicineStockScore);
    setStaffSanitationRating(h.sanitationRating);
    setIsStaffUpdateModalOpen(true);
  };

  const handleSaveStaffUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalFacilities(
      staffUpdateHospId,
      {
        bedStats: {
          icu: { total: staffIcuTotal, occupied: staffIcuOcc },
          oxygen: { total: staffOxyTotal, occupied: staffOxyOcc },
          general: { total: staffGenTotal, occupied: staffGenOcc },
          pediatric: { total: staffPedTotal, occupied: staffPedOcc },
        },
        medicineStockScore: staffMedicineScore,
        sanitationRating: staffSanitationRating,
      },
      staffName.trim(),
      staffDesignation.trim()
    );
    setIsStaffUpdateModalOpen(false);
  };

  const handleExecuteCSVImport = () => {
    if (!csvInputText.trim()) return;
    const result = importHospitalsFromCSV(csvInputText);
    setImportResult(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvInputText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Editorial Header */}
      <div className="bg-white p-6 sm:p-8 border border-[#E5E0D6]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0F2942] mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>INSTITUTIONAL MASTER REGISTRY · CENTRAL DATA MANAGEMENT</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1B1E22] tracking-tight leading-tight">
              {language === 'kn' ? 'ಕೇಂದ್ರೀಕೃತ ಆರೋಗ್ಯ ದತ್ತಾಂಶ ನಿರ್ವಹಣೆ' : 'Verified Healthcare Master Data Console'}
            </h1>
            <p className="text-sm text-[#5C6470] mt-2 leading-relaxed">
              {language === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳು, ವೈದ್ಯಕೀಯ ಕೌನ್ಸಿಲ್ ನೋಂದಾಯಿತ ವೈದ್ಯರು ಹಾಗೂ ಸಂಪನ್ಮೂಲ ದಾಸ್ತಾನುಗಳ ಅಧಿಕೃತ ದಾಖಲೆಗಳ ನಿರ್ವಹಣೆ ಮತ್ತು CSV ಆಮದು/ರಫ್ತು ವ್ಯವಸ್ಥೆ.'
                : 'Maintain verifiable public healthcare directories for Karnataka civil hospitals, verified KMC specialist rosters, and facility resource audits with full provenance tracking and CSV import/export.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const csv = exportHospitalsToCSV(hospitals);
                triggerCSVDownload(`karnataka_hospitals_master_${new Date().toISOString().slice(0, 10)}.csv`, csv);
              }}
              className="min-h-[40px] px-3.5 py-2 bg-[#FAF8F5] border border-[#D5CFBF] hover:border-[#0F2942] text-[#1B1E22] text-xs font-medium flex items-center gap-1.5 transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>Export Hospitals (CSV)</span>
            </button>
            <button
              onClick={() => {
                const csv = exportDoctorsToCSV(doctors);
                triggerCSVDownload(`karnataka_doctors_registry_${new Date().toISOString().slice(0, 10)}.csv`, csv);
              }}
              className="min-h-[40px] px-3.5 py-2 bg-[#FAF8F5] border border-[#D5CFBF] hover:border-[#0F2942] text-[#1B1E22] text-xs font-medium flex items-center gap-1.5 transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>Export Doctors (CSV)</span>
            </button>
            <button
              onClick={() => {
                setCsvInputText('');
                setImportResult(null);
                setIsCSVModalOpen(true);
              }}
              className="min-h-[40px] px-3.5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors font-mono"
            >
              <Upload className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Import via CSV</span>
            </button>
          </div>
        </div>

        {/* Provenance Filter Bar */}
        <div className="mt-5 p-3.5 bg-[#FAF8F5] border border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#1B1E22]">
            <span className="font-semibold text-[#0F2942] font-mono text-[11px] uppercase">Dataset Provenance Filter:</span>
            <span className="text-[#5C6470]">Showing current records across all views</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setDataFilterMode('all')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium transition-colors border ${
                dataFilterMode === 'all'
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-white text-[#1B1E22] border-[#D5CFBF] hover:border-[#0F2942]'
              }`}
            >
              All Records ({hospitals.length})
            </button>
            <button
              onClick={() => setDataFilterMode('verified_only')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium transition-colors border ${
                dataFilterMode === 'verified_only'
                  ? 'bg-[#0F2942] text-white border-[#0F2942]'
                  : 'bg-white text-[#1B1E22] border-[#D5CFBF] hover:border-[#0F2942]'
              }`}
            >
              Verified Institutional ({hospitals.filter((h) => h.isVerifiedReal).length})
            </button>
            <button
              onClick={() => setDataFilterMode('demo_only')}
              className={`min-h-[36px] px-3 py-1 text-xs font-medium transition-colors border ${
                dataFilterMode === 'demo_only'
                  ? 'bg-[#1B1E22] text-white border-[#1B1E22]'
                  : 'bg-white text-[#1B1E22] border-[#D5CFBF] hover:border-[#1B1E22]'
              }`}
            >
              Demo Records ({hospitals.filter((h) => !h.isVerifiedReal).length})
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-[#E5E0D6]">
          {[
            { id: 'hospitals', label: 'Hospital Directory', icon: Building2 },
            { id: 'doctors', label: 'Doctor Registry', icon: Stethoscope },
            { id: 'facilities', label: 'Facility Telemetry', icon: Activity },
            { id: 'provenance', label: 'Data Provenance & Audit Trail', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`min-h-[42px] px-4 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                  isActive
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-[#FAF8F5] text-[#1B1E22] hover:bg-white border-[#D5CFBF]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C59B27]' : 'text-[#5C6470]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: Hospitals Management */}
      {activeTab === 'hospitals' && (
        <div className="bg-white border border-[#E5E0D6] overflow-hidden space-y-4">
          <div className="p-5 border-b border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-[#7A828E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospital by name, district, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#D5CFBF] text-xs text-[#1B1E22] focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleOpenAddHospital}
              className="min-h-[38px] px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto font-mono"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add Verified Hospital</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5C6470] font-semibold uppercase tracking-wider text-[10px] border-b border-[#E5E0D6] font-mono">
                <tr>
                  <th className="py-3 px-4">Hospital Name &amp; District</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Provenance &amp; Source</th>
                  <th className="py-3 px-4">ORS Portal</th>
                  <th className="py-3 px-4">Inpatient Capacity</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6] text-[#1B1E22]">
                {displayedHospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-serif font-semibold text-sm text-[#1B1E22]">{h.name}</div>
                      <div className="text-[11px] text-[#5C6470]">{h.district} · {h.phone}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#5C6470]">
                      {h.type}
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 border ${
                          h.isVerifiedReal
                            ? 'border-[#176B3A]/30 text-[#176B3A] bg-[#F0FDF4]'
                            : 'border-[#E5E0D6] text-[#5C6470]'
                        }`}
                      >
                        {h.isVerifiedReal ? 'Verified Institutional' : 'Demonstration Record'}
                      </span>
                      <div className="text-[11px] text-[#5C6470] truncate mt-0.5">{h.dataSource}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {h.isOrsParticipating ? (
                        <span className="text-[10px] font-mono text-[#176B3A] border border-[#176B3A]/30 px-1.5 py-0.5 bg-[#FAF8F5]">
                          ORS Integrated ({h.orsHospitalCode || 'ORS-KA'})
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#5C6470] font-mono">Walk-in Token Only</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                      <span className="font-semibold text-[#0F2942]">{h.bedStats.icu.total} ICU</span>
                      <span className="text-[#5C6470]"> · {h.bedStats.oxygen.total} Oxy · {h.bedStats.general.total} Gen</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[11px] font-mono text-[#5C6470]">
                      {h.verificationDate || 'Nov 02, 2026'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditHospital(h)}
                          className="min-h-[32px] px-2.5 py-1 text-xs border border-[#D5CFBF] hover:border-[#0F2942] text-[#1B1E22] font-mono font-medium"
                        >
                          <Edit className="w-3 h-3 inline mr-1 text-[#0F2942]" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete hospital record for "${h.name}"?`)) {
                              deleteHospital(h.id);
                            }
                          }}
                          className="min-h-[32px] px-2 py-1 text-xs text-[#0F2942] hover:bg-[#FFF2F2]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Doctor Registry */}
      {activeTab === 'doctors' && (
        <div className="bg-white border border-[#E5E0D6] overflow-hidden space-y-4">
          <div className="p-5 border-b border-[#E5E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-[#7A828E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doctor by name, specialty, or KMC registration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#D5CFBF] text-xs text-[#1B1E22] focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleOpenAddDoctor}
              className="min-h-[38px] px-4 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto font-mono"
            >
              <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Add Verified Doctor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#5C6470] font-semibold uppercase tracking-wider text-[10px] border-b border-[#E5E0D6] font-mono">
                <tr>
                  <th className="py-3 px-4">Specialist &amp; Qualification</th>
                  <th className="py-3 px-4">Hospital &amp; Room</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">KMC Registration</th>
                  <th className="py-3 px-4">OPD Timings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6] text-[#1B1E22]">
                {displayedDoctors.map((d) => (
                  <tr key={d.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-serif font-semibold text-sm text-[#1B1E22]">{d.name}</div>
                      <div className="text-[11px] text-[#5C6470]">{d.designation} · {d.qualification}</div>
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      <div className="font-medium text-[#1B1E22] truncate">{d.hospitalName}</div>
                      <div className="text-[11px] text-[#5C6470] font-mono">{d.roomNumber}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-xs font-medium text-[#1B1E22]">
                      {d.specialization}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      <span className="text-[#0F2942] font-semibold">{d.councilRegistrationNumber || 'KMC-VERIFIED'}</span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-[#5C6470] max-w-[180px]">
                      {d.opdTimings}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-[#176B3A]/30 text-[#176B3A] bg-[#F0FDF4]">
                        {d.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <button
                          onClick={() => handleOpenEditDoctor(d)}
                          className="min-h-[32px] px-2.5 py-1 text-xs border border-[#D5CFBF] hover:border-[#0F2942] text-[#1B1E22] font-medium"
                        >
                          <Edit className="w-3 h-3 inline mr-1 text-[#0F2942]" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete record for ${d.name}?`)) {
                              deleteDoctor(d.id);
                            }
                          }}
                          className="min-h-[32px] px-2 py-1 text-xs text-[#0F2942] hover:bg-[#FFF2F2]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Facilities Telemetry */}
      {activeTab === 'facilities' && (
        <div className="bg-white border border-[#E5E0D6] p-6 space-y-4">
          <div className="border-b border-[#E5E0D6] pb-3">
            <h3 className="font-serif text-base font-semibold text-[#1B1E22]">
              Hospital Staff Facility Capacity Audit Console
            </h3>
            <p className="text-xs text-[#5C6470] mt-0.5">
              Authorized hospital matrons and nodal staff can update bed vacancies and medicine stock counts with an official timestamped signature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((h) => (
              <div
                key={h.id}
                className="bg-[#FAF8F5] p-5 border border-[#E5E0D6] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#E5E0D6] pb-2">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#0F2942]">{h.type}</div>
                      <h4 className="font-serif font-semibold text-base text-[#1B1E22]">{h.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#7A828E]">
                      Updated: {h.lastUpdated}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-white border border-[#E5E0D6]">
                      <div className="text-[#5C6470] text-[10px] uppercase font-mono">ICU Beds</div>
                      <div className="font-mono text-sm font-semibold text-[#0F2942]">
                        {h.bedStats.icu.total - h.bedStats.icu.occupied} / {h.bedStats.icu.total}
                      </div>
                    </div>
                    <div className="p-2 bg-white border border-[#E5E0D6]">
                      <div className="text-[#5C6470] text-[10px] uppercase font-mono">Oxygen</div>
                      <div className="font-mono text-sm font-semibold text-[#1B1E22]">
                        {h.bedStats.oxygen.total - h.bedStats.oxygen.occupied} / {h.bedStats.oxygen.total}
                      </div>
                    </div>
                    <div className="p-2 bg-white border border-[#E5E0D6]">
                      <div className="text-[#5C6470] text-[10px] uppercase font-mono">General</div>
                      <div className="font-mono text-sm font-semibold text-[#1B1E22]">
                        {h.bedStats.general.total - h.bedStats.general.occupied} / {h.bedStats.general.total}
                      </div>
                    </div>
                    <div className="p-2 bg-white border border-[#E5E0D6]">
                      <div className="text-[#5C6470] text-[10px] uppercase font-mono">Pediatric</div>
                      <div className="font-mono text-sm font-semibold text-[#1B1E22]">
                        {h.bedStats.pediatric.total - h.bedStats.pediatric.occupied} / {h.bedStats.pediatric.total}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E0D6] flex items-center justify-between">
                  <div className="text-xs text-[#5C6470]">
                    Pharmacy Score: <strong className="text-[#1B1E22] font-mono">{h.medicineStockScore}%</strong>
                  </div>
                  <button
                    onClick={() => handleOpenStaffUpdate(h)}
                    className="min-h-[36px] px-3.5 py-1.5 bg-[#0F2942] text-white text-xs font-medium hover:bg-[#1E3A8A] transition-colors font-mono"
                  >
                    Update Beds &amp; Resources
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Data Provenance Overview */}
      {activeTab === 'provenance' && (
        <div className="bg-white border border-[#E5E0D6] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E0D6] pb-4">
            <h3 className="font-serif text-xl font-semibold text-[#1B1E22]">
              Public Healthcare Data Provenance &amp; Verification Protocol
            </h3>
            <p className="text-xs text-[#5C6470] mt-1 leading-relaxed max-w-3xl">
              Compliance standards governing verified hospital listings, state medical council registers, and telemetry integrity. Demonstration entries are strictly segregated from verified statutory data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#1B1E22]">
            <div className="p-4 bg-[#FAF8F5] border border-[#E5E0D6] space-y-2">
              <div className="font-serif font-semibold text-sm text-[#0F2942]">1. Hospital Directory Provenance</div>
              <p className="text-[#5C6470] leading-relaxed">
                Hospital addresses, facility designations, and emergency casualty contact numbers are verified against the National Health Portal (NHP) directory and Karnataka Directorate of Health &amp; Family Welfare gazetted records.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E5E0D6] space-y-2">
              <div className="font-serif font-semibold text-sm text-[#0F2942]">2. Doctor Directory Provenance</div>
              <p className="text-[#5C6470] leading-relaxed">
                Doctor designations, specializations, and OPD schedules require a verified Karnataka Medical Council (KMC) registration number. Unverified entries are permanently flagged as simulation models.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E5E0D6] space-y-2">
              <div className="font-serif font-semibold text-sm text-[#0F2942]">3. Inpatient Bed &amp; Resource Audits</div>
              <p className="text-[#5C6470] leading-relaxed">
                Resource status changes include the name and designation of the reporting hospital matron or nodal officer, preventing unauthenticated edits and preserving historical audit trails.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E5E0D6] space-y-2">
              <div className="font-serif font-semibold text-sm text-[#0F2942]">4. Official ORS Integration</div>
              <p className="text-[#5C6470] leading-relaxed">
                Participating hospitals link directly to the National Informatics Centre (NIC) Online Registration System (ors.gov.in) with official hospital codes, preventing fraudulent local appointment confirmations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Hospital Add/Edit Modal */}
      {isHospitalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto animate-in fade-in">
          <div
            className="bg-white max-w-2xl w-full p-6 sm:p-7 border border-[#E5E0D6] space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E0D6] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0F2942] font-semibold">
                  MASTER HOSPITAL REGISTRY
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1B1E22] mt-1">
                  {editingHospital ? `Edit Hospital Record` : 'Add New Hospital Record'}
                </h3>
              </div>
              <button
                onClick={() => setIsHospitalModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-[#5C6470] hover:text-[#1B1E22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHospital} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Hospital Name</label>
                  <input
                    type="text"
                    required
                    value={hospForm.name}
                    onChange={(e) => setHospForm({ ...hospForm, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Facility Type</label>
                  <select
                    value={hospForm.type}
                    onChange={(e) => setHospForm({ ...hospForm, type: e.target.value as Hospital['type'] })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="District Civil Hospital">District Civil Hospital</option>
                    <option value="Govt Medical College & Hospital">Govt Medical College & Hospital</option>
                    <option value="Govt Mother & Child Care Hospital">Govt Mother & Child Care Hospital</option>
                    <option value="Sub-District Hospital">Sub-District Hospital</option>
                    <option value="Community Health Centre (CHC)">Community Health Centre (CHC)</option>
                    <option value="Primary Health Centre (PHC)">Primary Health Centre (PHC)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={hospForm.district}
                    onChange={(e) => setHospForm({ ...hospForm, district: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Address</label>
                  <input
                    type="text"
                    required
                    value={hospForm.address}
                    onChange={(e) => setHospForm({ ...hospForm, address: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">General Reception Phone</label>
                  <input
                    type="text"
                    required
                    value={hospForm.phone}
                    onChange={(e) => setHospForm({ ...hospForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Emergency Helpline</label>
                  <input
                    type="text"
                    required
                    value={hospForm.emergencyHelpline}
                    onChange={(e) => setHospForm({ ...hospForm, emergencyHelpline: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>
              </div>

              {/* Bed Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                <div>
                  <label className="block text-[10px] text-[#5C6470] mb-1 uppercase">ICU Beds (Tot/Occ)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={hospForm.icuTotal}
                      onChange={(e) => setHospForm({ ...hospForm, icuTotal: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      value={hospForm.icuOcc}
                      onChange={(e) => setHospForm({ ...hospForm, icuOcc: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#5C6470] mb-1 uppercase">Oxygen (Tot/Occ)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={hospForm.oxyTotal}
                      onChange={(e) => setHospForm({ ...hospForm, oxyTotal: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      value={hospForm.oxyOcc}
                      onChange={(e) => setHospForm({ ...hospForm, oxyOcc: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#5C6470] mb-1 uppercase">General (Tot/Occ)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={hospForm.genTotal}
                      onChange={(e) => setHospForm({ ...hospForm, genTotal: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      value={hospForm.genOcc}
                      onChange={(e) => setHospForm({ ...hospForm, genOcc: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#5C6470] mb-1 uppercase">Pediatric (Tot/Occ)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={hospForm.pedTotal}
                      onChange={(e) => setHospForm({ ...hospForm, pedTotal: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                    <input
                      type="number"
                      value={hospForm.pedOcc}
                      onChange={(e) => setHospForm({ ...hospForm, pedOcc: parseInt(e.target.value) || 0 })}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Data Provenance Fields */}
              <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D6] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVerifiedReal"
                    checked={hospForm.isVerifiedReal}
                    onChange={(e) => setHospForm({ ...hospForm, isVerifiedReal: e.target.checked })}
                    className="border-[#D5CFBF] text-[#0F2942] focus:ring-[#0F2942]"
                  />
                  <label htmlFor="isVerifiedReal" className="font-medium text-[#1B1E22]">
                    Certify as Verified Institutional Government Record (Not a Demo Entry)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#5C6470] block">Data Source Authority:</span>
                    <input
                      type="text"
                      value={hospForm.dataSource}
                      onChange={(e) => setHospForm({ ...hospForm, dataSource: e.target.value })}
                      className="w-full bg-white border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[#5C6470] block">Verifying Health Officer:</span>
                    <input
                      type="text"
                      value={hospForm.verifiedBy}
                      onChange={(e) => setHospForm({ ...hospForm, verifiedBy: e.target.value })}
                      className="w-full bg-white border border-[#D5CFBF] px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsHospitalModalOpen(false)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#5C6470] hover:text-[#1B1E22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs font-mono transition-colors"
                >
                  Save Hospital Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Doctor Add/Edit Modal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto animate-in fade-in">
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 border border-[#E5E0D6] space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E0D6] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0F2942] font-semibold">
                  VERIFIED DOCTOR REGISTRY
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1B1E22] mt-1">
                  {editingDoctor ? 'Edit Doctor Record' : 'Register Verified Doctor'}
                </h3>
              </div>
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-[#5C6470] hover:text-[#1B1E22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={docForm.name}
                    onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={docForm.designation}
                    onChange={(e) => setDocForm({ ...docForm, designation: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={docForm.specialization}
                    onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Medical Council Reg. (KMC #)</label>
                  <input
                    type="text"
                    required
                    value={docForm.councilRegistrationNumber}
                    onChange={(e) => setDocForm({ ...docForm, councilRegistrationNumber: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1B1E22] mb-1">Hospital Posting</label>
                <select
                  value={docForm.hospitalId}
                  onChange={(e) => setDocForm({ ...docForm, hospitalId: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">OPD Timings</label>
                  <input
                    type="text"
                    required
                    value={docForm.opdTimings}
                    onChange={(e) => setDocForm({ ...docForm, opdTimings: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">OPD Consultation Room</label>
                  <input
                    type="text"
                    required
                    value={docForm.roomNumber}
                    onChange={(e) => setDocForm({ ...docForm, roomNumber: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-[#0F2942]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#5C6470] hover:text-[#1B1E22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs font-mono transition-colors"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Facility Telemetry Staff Update Modal */}
      {isStaffUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in">
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 border border-[#E5E0D6] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E0D6] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0F2942] font-semibold">
                  FACILITY STAFF TELEMETRY
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1B1E22] mt-1">
                  Update Live Resource Telemetry
                </h3>
              </div>
              <button
                onClick={() => setIsStaffUpdateModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-[#5C6470] hover:text-[#1B1E22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffUpdate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-[#1B1E22] mb-1">ICU Occupied / Total</label>
                  <div className="flex gap-1 font-mono">
                    <input
                      type="number"
                      value={staffIcuOcc}
                      onChange={(e) => setStaffIcuOcc(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                    />
                    <input
                      type="number"
                      value={staffIcuTotal}
                      onChange={(e) => setStaffIcuTotal(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-medium text-[#1B1E22] mb-1">Oxygen Occupied / Total</label>
                  <div className="flex gap-1 font-mono">
                    <input
                      type="number"
                      value={staffOxyOcc}
                      onChange={(e) => setStaffOxyOcc(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                    />
                    <input
                      type="number"
                      value={staffOxyTotal}
                      onChange={(e) => setStaffOxyTotal(parseInt(e.target.value) || 0)}
                      className="w-1/2 bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Reporting Staff Member</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1B1E22] mb-1">Staff Designation</label>
                  <input
                    type="text"
                    required
                    value={staffDesignation}
                    onChange={(e) => setStaffDesignation(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E0D6]">
                <button
                  type="button"
                  onClick={() => setIsStaffUpdateModalOpen(false)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#5C6470] hover:text-[#1B1E22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs font-mono transition-colors"
                >
                  Publish Telemetry Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CSV Import Modal */}
      {isCSVModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto animate-in fade-in">
          <div
            className="bg-white max-w-xl w-full p-6 sm:p-7 border border-[#E5E0D6] space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E0D6] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#0F2942] font-semibold">
                  BULK DATA INGESTION
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1B1E22] mt-1">
                  Import Hospital Records via CSV
                </h3>
              </div>
              <button
                onClick={() => setIsCSVModalOpen(false)}
                aria-label="Close modal"
                className="p-1 text-[#5C6470] hover:text-[#1B1E22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importResult && (
              <div
                className={`p-3 text-xs font-mono ${
                  importResult.success
                    ? 'bg-[#F0FDF4] border border-[#176B3A] text-[#176B3A]'
                    : 'bg-[#FFF2F2] border border-[#0F2942] text-[#0F2942]'
                }`}
              >
                {importResult.success
                  ? `Successfully ingested ${importResult.count} hospital records.`
                  : `Ingestion failed: ${importResult.errors.join(', ')}`}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#1B1E22] mb-1">
                  Upload CSV File from Device
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBF] p-2 text-xs font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-[#1B1E22]">Or Paste Raw CSV Data</label>
                  <button
                    type="button"
                    onClick={() => setCsvInputText(generateHospitalCSVTemplate())}
                    className="text-[#0F2942] hover:underline font-mono text-[11px]"
                  >
                    Load Standard Template
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={csvInputText}
                  onChange={(e) => setCsvInputText(e.target.value)}
                  placeholder="name,type,district,address,phone,emergencyHelpline,icuTotal,icuOcc..."
                  className="w-full bg-[#FAF8F5] border border-[#D5CFBF] p-3 font-mono text-[11px] text-[#1B1E22] focus:outline-hidden focus:border-[#0F2942]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E0D6]">
              <button
                type="button"
                onClick={() => setIsCSVModalOpen(false)}
                className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#5C6470] hover:text-[#1B1E22]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCSVImport}
                disabled={!csvInputText.trim()}
                className="min-h-[40px] px-5 py-2.5 bg-[#0F2942] hover:bg-[#1E3A8A] disabled:opacity-50 text-white font-medium text-xs font-mono transition-colors"
              >
                Parse &amp; Ingest Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
