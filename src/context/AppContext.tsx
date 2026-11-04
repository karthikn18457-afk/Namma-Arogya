import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Hospital,
  Doctor,
  Complaint,
  Appointment,
  MedicineItem,
  PublicNotice,
  ComplaintStatus,
  ForwardingStatus,
  DistrictHealthOfficer,
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_COMPLAINTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICINES,
  INITIAL_NOTICES,
  INITIAL_DHO_CONTACTS,
} from '../data/mockData';
import { parseHospitalsFromCSV } from '../services/dataService';

export type TabType =
  | 'home'
  | 'hospitals'
  | 'doctors'
  | 'appointment'
  | 'report'
  | 'track'
  | 'facilities'
  | 'dashboard'
  | 'gov-comm'
  | 'data-mgmt'
  | 'about';

export type DataFilterMode = 'all' | 'verified_only' | 'demo_only';

interface AppContextType {
  language: 'en' | 'kn';
  setLanguage: (lang: 'en' | 'kn') => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hospitals: Hospital[];
  doctors: Doctor[];
  complaints: Complaint[];
  appointments: Appointment[];
  medicines: MedicineItem[];
  notices: PublicNotice[];
  dhoContacts: DistrictHealthOfficer[];
  userRole: 'citizen' | 'admin';
  setUserRole: (role: 'citizen' | 'admin') => void;
  dataFilterMode: DataFilterMode;
  setDataFilterMode: (mode: DataFilterMode) => void;
  selectedHospitalDetail: Hospital | null;
  setSelectedHospitalDetail: (hospital: Hospital | null) => void;
  preselectedHospitalId: string | null;
  setPreselectedHospitalId: (id: string | null) => void;
  preselectedDoctorId: string | null;
  setPreselectedDoctorId: (id: string | null) => void;
  preselectedReportHospitalId: string | null;
  setPreselectedReportHospitalId: (id: string | null) => void;
  trackingQueryId: string;
  setTrackingQueryId: (id: string) => void;
  // Hospital CRUD (Requirement 1 & 6)
  addHospital: (h: Omit<Hospital, 'id'>) => Hospital;
  updateHospital: (id: string, h: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;
  importHospitalsFromCSV: (csvText: string) => { success: boolean; count: number; errors: string[] };
  // Doctor CRUD (Requirement 2 & 6)
  addDoctor: (d: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (id: string, d: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  // Facilities telemetry update (Requirement 3)
  updateHospitalFacilities: (
    hospitalId: string,
    updates: {
      bedStats?: Hospital['bedStats'];
      medicineStockScore?: number;
      ambulanceCount?: Hospital['ambulanceCount'];
      sanitationRating?: number;
    },
    staffName: string,
    staffDesignation: string
  ) => void;
  // Complaints and Forwarding
  addComplaint: (data: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'timeline' | 'isActuallyForwarded'>) => Complaint;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    note: string,
    officer: string
  ) => void;
  forwardComplaintToGovt: (
    id: string,
    portal: string,
    ackNumber: string,
    responseDetails: string,
    forwardedBy: string,
    status: ForwardingStatus,
    forwardingNotes?: string
  ) => void;
  addAppointment: (data: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt' | 'status'>) => Appointment;
  cancelAppointment: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HOSPITALS: 'janaseva_hospitals_v2',
  DOCTORS: 'janaseva_doctors_v2',
  COMPLAINTS: 'janaseva_complaints_v2',
  APPOINTMENTS: 'janaseva_appointments_v2',
  FILTER_MODE: 'janaseva_filter_mode_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userRole, setUserRole] = useState<'citizen' | 'admin'>('citizen');
  const [selectedHospitalDetail, setSelectedHospitalDetail] = useState<Hospital | null>(null);

  // Global data filter: real verified records vs demonstration simulation
  const [dataFilterMode, setDataFilterMode] = useState<DataFilterMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILTER_MODE);
      if (saved && (saved === 'all' || saved === 'verified_only' || saved === 'demo_only')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'all';
  });

  // Cross navigation parameters
  const [preselectedHospitalId, setPreselectedHospitalId] = useState<string | null>(null);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);
  const [preselectedReportHospitalId, setPreselectedReportHospitalId] = useState<string | null>(null);
  const [trackingQueryId, setTrackingQueryId] = useState<string>('');

  // Reactive state synced with localStorage
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_HOSPITALS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_DOCTORS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COMPLAINTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_APPOINTMENTS;
  });

  const [medicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [notices] = useState<PublicNotice[]>(INITIAL_NOTICES);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(hospitals));
    } catch {
      // ignore
    }
  }, [hospitals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch {
      // ignore
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch {
      // ignore
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FILTER_MODE, dataFilterMode);
    } catch {
      // ignore
    }
  }, [dataFilterMode]);

  // Hospital CRUD
  const addHospital = (hData: Omit<Hospital, 'id'>): Hospital => {
    const id = `hosp-reg-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHosp: Hospital = {
      ...hData,
      id,
      lastUpdated: 'Just now',
    };
    setHospitals((prev) => [newHosp, ...prev]);
    return newHosp;
  };

  const updateHospital = (id: string, updates: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              ...updates,
              lastUpdated: 'Just now (Updated)',
            }
          : h
      )
    );
  };

  const deleteHospital = (id: string) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
    // also cascade delete doctor assignments or keep them
  };

  const importHospitalsFromCSV = (csvText: string) => {
    const result = parseHospitalsFromCSV(csvText);
    if (result.success && result.hospitals.length > 0) {
      // Prepend or merge by ID
      setHospitals((prev) => {
        const existingIds = new Set(prev.map((h) => h.id));
        const newRecords = result.hospitals.filter((h) => !existingIds.has(h.id));
        const updatedExisting = prev.map((h) => {
          const match = result.hospitals.find((x) => x.id === h.id);
          return match || h;
        });
        return [...newRecords, ...updatedExisting];
      });
      return { success: true, count: result.hospitals.length, errors: result.errors };
    }
    return { success: false, count: 0, errors: result.errors };
  };

  // Doctor CRUD
  const addDoctor = (dData: Omit<Doctor, 'id'>): Doctor => {
    const id = `doc-reg-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDoc: Doctor = {
      ...dData,
      id,
    };
    setDoctors((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // Facilities staff update (Requirement 3)
  const updateHospitalFacilities = (
    hospitalId: string,
    updates: {
      bedStats?: Hospital['bedStats'];
      medicineStockScore?: number;
      ambulanceCount?: Hospital['ambulanceCount'];
      sanitationRating?: number;
    },
    staffName: string,
    staffDesignation: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        return {
          ...h,
          bedStats: updates.bedStats || h.bedStats,
          medicineStockScore: updates.medicineStockScore !== undefined ? updates.medicineStockScore : h.medicineStockScore,
          ambulanceCount: updates.ambulanceCount || h.ambulanceCount,
          sanitationRating: updates.sanitationRating !== undefined ? updates.sanitationRating : h.sanitationRating,
          lastUpdated: `${dateStr} ${timeStr} (by ${staffName}, ${staffDesignation})`,
          lastStaffUpdateBy: `${staffName} (${staffDesignation})`,
        };
      })
    );
  };

  // Complaints
  const addComplaint = (
    data: Omit<Complaint, 'id' | 'submittedAt' | 'status' | 'timeline' | 'isActuallyForwarded'>
  ): Complaint => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const id = `JNS-GRV-${randomNum}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr} ${timeStr}`;

    const newComplaint: Complaint = {
      ...data,
      id,
      submittedAt: formattedTimestamp,
      status: 'Submitted',
      forwardingStatus: 'Received',
      isActuallyForwarded: false, // Requirement 10: Clear identification of non-forwarded state
      timeline: [
        {
          step: 'Submitted',
          timestamp: formattedTimestamp,
          note: `Grievance registered under ticket #${id}. Saved in local database awaiting official authority review.`,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const forwardComplaintToGovt = (
    id: string,
    portal: string,
    ackNumber: string,
    responseDetails: string,
    forwardedBy: string,
    status: ForwardingStatus,
    forwardingNotes?: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr} ${timeStr}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const timelineStep: ComplaintStatus =
          status === 'Resolved'
            ? 'Resolved'
            : status === 'Action Taken'
            ? 'Action Taken'
            : status === 'Forwarded' || status === 'Acknowledged'
            ? 'Under Review'
            : c.status;

        const isForwarded = status !== 'Received' && status !== 'Awaiting Forwarding';

        const updatedTimeline = [
          ...c.timeline,
          {
            step: timelineStep,
            timestamp: formattedTimestamp,
            note: `Government Forwarding Update [${status} via ${portal}]: Ack Ref: ${ackNumber || 'N/A'}. ${responseDetails || ''}`.trim(),
            officer: forwardedBy || 'District Health Officer',
          },
        ];

        return {
          ...c,
          status: timelineStep,
          forwardingStatus: status,
          isActuallyForwarded: isForwarded, // Requirement 10
          forwardingAuthorityName: portal,
          forwardedToPortal: portal || c.forwardedToPortal,
          forwardedAt: c.forwardedAt || formattedTimestamp,
          forwardedBy: forwardedBy || c.forwardedBy,
          officialAckNumber: ackNumber || c.officialAckNumber,
          officialResponseDetails: responseDetails || c.officialResponseDetails,
          forwardingNotes: forwardingNotes || c.forwardingNotes,
          assignedOfficer: forwardedBy || c.assignedOfficer,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintStatus,
    note: string,
    officer: string
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `${dateStr} ${timeStr}`;

    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedTimeline = [
          ...item.timeline,
          {
            step: status,
            timestamp: formattedTimestamp,
            note: note || `Status updated to ${status}.`,
            officer: officer || 'District Health Officer',
          },
        ];

        return {
          ...item,
          status,
          forwardingStatus: status === 'Resolved' ? 'Resolved' : status === 'Action Taken' ? 'Action Taken' : item.forwardingStatus,
          assignedOfficer: officer || item.assignedOfficer,
          resolutionNote: status === 'Resolved' ? (note || item.resolutionNote) : item.resolutionNote,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const addAppointment = (
    data: Omit<Appointment, 'id' | 'referenceCode' | 'createdAt' | 'status'>
  ): Appointment => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `JNS-APT-2026-${randomNum}`;
    const refCode = `JNS-${randomNum}-${data.department.slice(0, 3).toUpperCase()}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAppointment: Appointment = {
      ...data,
      id,
      referenceCode: refCode,
      createdAt: `${dateStr} ${timeStr}`,
      status: 'Confirmed',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' } : apt))
    );
  };

  const resetDemoData = () => {
    setHospitals(INITIAL_HOSPITALS);
    setDoctors(INITIAL_DOCTORS);
    setComplaints(INITIAL_COMPLAINTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setDataFilterMode('all');
    try {
      localStorage.removeItem(STORAGE_KEYS.HOSPITALS);
      localStorage.removeItem(STORAGE_KEYS.DOCTORS);
      localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
      localStorage.removeItem(STORAGE_KEYS.FILTER_MODE);
    } catch {
      // ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        hospitals,
        doctors,
        complaints,
        appointments,
        medicines,
        notices,
        dhoContacts: INITIAL_DHO_CONTACTS,
        userRole,
        setUserRole,
        dataFilterMode,
        setDataFilterMode,
        selectedHospitalDetail,
        setSelectedHospitalDetail,
        preselectedHospitalId,
        setPreselectedHospitalId,
        preselectedDoctorId,
        setPreselectedDoctorId,
        preselectedReportHospitalId,
        setPreselectedReportHospitalId,
        trackingQueryId,
        setTrackingQueryId,
        addHospital,
        updateHospital,
        deleteHospital,
        importHospitalsFromCSV,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        updateHospitalFacilities,
        addComplaint,
        updateComplaintStatus,
        forwardComplaintToGovt,
        addAppointment,
        cancelAppointment,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
