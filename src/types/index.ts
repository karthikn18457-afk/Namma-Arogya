export type ComplaintCategory =
  | 'No Medicines'
  | 'Poor Sanitation'
  | 'Doctor Unavailability'
  | 'Broken Equipment'
  | 'Bed Shortage'
  | 'Water Problems'
  | 'Other';

export type ComplaintSeverity = 'Urgent' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';

export interface TimelineEvent {
  step: ComplaintStatus;
  timestamp: string;
  note: string;
  officer?: string;
}

export type ForwardingStatus =
  | 'Received'
  | 'Awaiting Forwarding'
  | 'Forwarded'
  | 'Acknowledged'
  | 'Action Taken'
  | 'Resolved';

export interface Complaint {
  id: string; // e.g., JNS-GRV-81042
  citizenName: string;
  citizenPhone: string;
  hospitalId: string;
  hospitalName: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  department: string;
  description: string;
  photoUrl?: string;
  submittedAt: string;
  status: ComplaintStatus;
  assignedOfficer?: string;
  resolutionNote?: string;
  publicTrackingToken?: string;
  timeline: TimelineEvent[];
  // Government Communication Centre Forwarding Workflow
  forwardingStatus?: ForwardingStatus;
  forwardedToPortal?: string;
  forwardedAt?: string;
  forwardedBy?: string;
  officialAckNumber?: string;
  officialResponseDetails?: string;
  forwardingNotes?: string;
  isActuallyForwarded: boolean;
  forwardingAuthorityName?: string;
}

export interface DistrictHealthOfficer {
  id: string;
  district: string;
  officerName: string;
  designation: string;
  email: string;
  phone: string;
  officeAddress: string;
  jurisdictionHospitals: string[];
  helplineHours: string;
}

export interface BedCategory {
  total: number;
  occupied: number;
}

export type HospitalFacilityType =
  | 'District Hospital'
  | 'General Hospital'
  | 'Taluk Hospital'
  | 'Primary Health Centre (PHC)'
  | 'District Civil Hospital'
  | 'Govt Medical College Hospital'
  | 'Mother & Child Care Hospital'
  | 'Community Health Centre (CHC)';

export interface Hospital {
  id: string;
  name: string;
  type: HospitalFacilityType;
  district: string;
  address: string;
  phone: string;
  emergencyHelpline: string;
  status: 'Open 24/7' | 'Open OPD Hours' | 'Emergency Only';
  lastUpdated: string;
  emergencyServices: boolean;
  departments: string[];
  bedStats: {
    icu: BedCategory;
    oxygen: BedCategory;
    general: BedCategory;
    pediatric: BedCategory;
  };
  facilities: string[];
  ambulanceCount: {
    total: number;
    ready: number;
  };
  medicineStockScore: number; // percentage 0-100
  sanitationRating: number; // 0-5
  nodalOfficer: string;
  directionsUrl?: string;
  imageUrl: string;
  // Verification and Data Provenance (Requirement 4 & 5)
  isVerifiedReal: boolean;
  dataSource: string;
  verificationDate: string;
  verifiedBy: string;
  isOrsParticipating?: boolean;
  orsHospitalCode?: string;
  lastStaffUpdateBy?: string;
}

export interface Doctor {
  id: string;
  name: string;
  designation: string;
  specialization: string;
  qualification: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  opdTimings: string;
  availableDays: string[];
  status: 'Available Today' | 'In Surgery' | 'On Leave' | 'Next OPD Tomorrow';
  avatarUrl: string;
  experienceYears: number;
  roomNumber: string;
  // Verification and Provenance
  isVerifiedReal: boolean;
  dataSource: string;
  verificationDate: string;
  councilRegistrationNumber?: string;
}

export interface Appointment {
  id: string; // e.g., JNS-APT-2026-9281
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  referenceCode: string;
  createdAt: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiac' | 'Respiratory' | 'Essential IV' | 'Vaccine';
  stockLevel: 'Adequate' | 'Moderate' | 'Critical Shortage';
  unitsAvailable: number;
  minimumRequired: number;
  daysOfSupplyLeft: number;
  hospitalId: string;
  hospitalName: string;
  lastAudited: string;
}

export interface PublicNotice {
  id: string;
  title: string;
  category: 'Health Advisory' | 'Free Camp' | 'Hospital Facility' | 'Emergency Alert';
  date: string;
  summary: string;
  hospitalName: string;
  isUrgent?: boolean;
}
