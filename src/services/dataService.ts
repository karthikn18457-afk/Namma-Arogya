import { Hospital, Doctor } from '../types';

/**
 * Utility to convert an array of Hospital records into a standard CSV string.
 */
export function exportHospitalsToCSV(hospitals: Hospital[]): string {
  const headers = [
    'ID',
    'Name',
    'Type',
    'District',
    'Address',
    'Phone',
    'EmergencyHelpline',
    'Status',
    'ICU_Total',
    'ICU_Occupied',
    'Oxygen_Total',
    'Oxygen_Occupied',
    'General_Total',
    'General_Occupied',
    'Pediatric_Total',
    'Pediatric_Occupied',
    'MedicineStockScore',
    'SanitationRating',
    'NodalOfficer',
    'IsVerifiedReal',
    'DataSource',
    'VerificationDate',
    'VerifiedBy',
    'IsOrsParticipating',
    'OrsHospitalCode',
  ];

  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = hospitals.map((h) => [
    escapeCSV(h.id),
    escapeCSV(h.name),
    escapeCSV(h.type),
    escapeCSV(h.district),
    escapeCSV(h.address),
    escapeCSV(h.phone),
    escapeCSV(h.emergencyHelpline),
    escapeCSV(h.status),
    escapeCSV(h.bedStats.icu.total),
    escapeCSV(h.bedStats.icu.occupied),
    escapeCSV(h.bedStats.oxygen.total),
    escapeCSV(h.bedStats.oxygen.occupied),
    escapeCSV(h.bedStats.general.total),
    escapeCSV(h.bedStats.general.occupied),
    escapeCSV(h.bedStats.pediatric.total),
    escapeCSV(h.bedStats.pediatric.occupied),
    escapeCSV(h.medicineStockScore),
    escapeCSV(h.sanitationRating),
    escapeCSV(h.nodalOfficer),
    escapeCSV(h.isVerifiedReal ? 'YES' : 'NO'),
    escapeCSV(h.dataSource),
    escapeCSV(h.verificationDate),
    escapeCSV(h.verifiedBy),
    escapeCSV(h.isOrsParticipating ? 'YES' : 'NO'),
    escapeCSV(h.orsHospitalCode || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Utility to export doctor records into CSV.
 */
export function exportDoctorsToCSV(doctors: Doctor[]): string {
  const headers = [
    'ID',
    'Name',
    'Designation',
    'Specialization',
    'Qualification',
    'HospitalID',
    'HospitalName',
    'Department',
    'OPDTimings',
    'AvailableDays',
    'Status',
    'ExperienceYears',
    'RoomNumber',
    'IsVerifiedReal',
    'DataSource',
    'VerificationDate',
    'CouncilRegistrationNumber',
  ];

  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = doctors.map((d) => [
    escapeCSV(d.id),
    escapeCSV(d.name),
    escapeCSV(d.designation),
    escapeCSV(d.specialization),
    escapeCSV(d.qualification),
    escapeCSV(d.hospitalId),
    escapeCSV(d.hospitalName),
    escapeCSV(d.department),
    escapeCSV(d.opdTimings),
    escapeCSV(d.availableDays.join('; ')),
    escapeCSV(d.status),
    escapeCSV(d.experienceYears),
    escapeCSV(d.roomNumber),
    escapeCSV(d.isVerifiedReal ? 'YES' : 'NO'),
    escapeCSV(d.dataSource),
    escapeCSV(d.verificationDate),
    escapeCSV(d.councilRegistrationNumber || ''),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Parses raw CSV content into Hospital records.
 */
export function parseHospitalsFromCSV(csvText: string): {
  success: boolean;
  hospitals: Hospital[];
  errors: string[];
} {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      success: false,
      hospitals: [],
      errors: ['CSV file is empty or missing data rows.'],
    };
  }

  const errors: string[] = [];
  const hospitals: Hospital[] = [];

  // Parse CSV line handling quotes
  const parseLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  for (let idx = 1; idx < lines.length; idx++) {
    try {
      const cols = parseLine(lines[idx]);
      if (cols.length < 6) {
        errors.push(`Row ${idx + 1}: Insufficient columns (found ${cols.length}, expected at least 6).`);
        continue;
      }

      const id = cols[0] || `hosp-imp-${Math.floor(1000 + Math.random() * 9000)}`;
      const name = cols[1];
      if (!name) {
        errors.push(`Row ${idx + 1}: Hospital name is required.`);
        continue;
      }

      const typeRaw = cols[2];
      const validTypes: Hospital['type'][] = [
        'District Civil Hospital',
        'District Hospital',
        'General Hospital',
        'Taluk Hospital',
        'Primary Health Centre (PHC)',
        'Govt Medical College Hospital',
        'Community Health Centre (CHC)',
        'Mother & Child Care Hospital',
      ];
      const type = validTypes.includes(typeRaw as Hospital['type'])
        ? (typeRaw as Hospital['type'])
        : 'District Civil Hospital';

      const district = cols[3] || 'Central District';
      const address = cols[4] || 'Government Hospital Compound';
      const phone = cols[5] || '+91 80-2222-0000';
      const emergencyHelpline = cols[6] || '108';
      const statusRaw = cols[7];
      const status = statusRaw === 'Open OPD Hours' ? 'Open OPD Hours' : 'Open 24/7';

      const icuTotal = parseInt(cols[8]) || 20;
      const icuOcc = parseInt(cols[9]) || 10;
      const oxyTotal = parseInt(cols[10]) || 60;
      const oxyOcc = parseInt(cols[11]) || 35;
      const genTotal = parseInt(cols[12]) || 200;
      const genOcc = parseInt(cols[13]) || 150;
      const pedTotal = parseInt(cols[14]) || 40;
      const pedOcc = parseInt(cols[15]) || 25;

      const medScore = parseInt(cols[16]) || 90;
      const sanScore = parseFloat(cols[17]) || 4.2;
      const nodal = cols[18] || 'Chief Medical Officer';
      const isVerified = (cols[19] || '').toUpperCase() === 'YES' || (cols[19] || '').toUpperCase() === 'TRUE';
      const dataSource = cols[20] || 'Imported via Centralized CSV Batch';
      const verDate = cols[21] || new Date().toISOString().slice(0, 10);
      const verifiedBy = cols[22] || 'District Health Officer (Batch Import)';
      const isOrs = (cols[23] || '').toUpperCase() === 'YES' || (cols[23] || '').toUpperCase() === 'TRUE';
      const orsCode = cols[24] || '';

      const hospital: Hospital = {
        id,
        name,
        type,
        district,
        address,
        phone,
        emergencyHelpline,
        status,
        lastUpdated: 'Just now (Imported)',
        emergencyServices: true,
        departments: ['General Medicine', 'Emergency', 'Pediatrics', 'Obstetrics & Gynecology'],
        bedStats: {
          icu: { total: icuTotal, occupied: Math.min(icuOcc, icuTotal) },
          oxygen: { total: oxyTotal, occupied: Math.min(oxyOcc, oxyTotal) },
          general: { total: genTotal, occupied: Math.min(genOcc, genTotal) },
          pediatric: { total: pedTotal, occupied: Math.min(pedOcc, pedTotal) },
        },
        facilities: ['24/7 Blood Bank', 'Digital X-Ray', 'Generic Pharmacy', 'Emergency Triage'],
        ambulanceCount: { total: 8, ready: 6 },
        medicineStockScore: medScore,
        sanitationRating: sanScore,
        nodalOfficer: nodal,
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
        isVerifiedReal: isVerified,
        dataSource,
        verificationDate: verDate,
        verifiedBy,
        isOrsParticipating: isOrs,
        orsHospitalCode: orsCode,
      };

      hospitals.push(hospital);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Row ${idx + 1}: ${msg}`);
    }
  }

  return {
    success: hospitals.length > 0,
    hospitals,
    errors,
  };
}

/**
 * Triggers a browser download of a CSV file.
 */
export function triggerCSVDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an empty CSV template for batch hospital data upload.
 */
export function generateHospitalCSVTemplate(): string {
  const headers = [
    'ID',
    'Name',
    'Type',
    'District',
    'Address',
    'Phone',
    'EmergencyHelpline',
    'Status',
    'ICU_Total',
    'ICU_Occupied',
    'Oxygen_Total',
    'Oxygen_Occupied',
    'General_Total',
    'General_Occupied',
    'Pediatric_Total',
    'Pediatric_Occupied',
    'MedicineStockScore',
    'SanitationRating',
    'NodalOfficer',
    'IsVerifiedReal',
    'DataSource',
    'VerificationDate',
    'VerifiedBy',
    'IsOrsParticipating',
    'OrsHospitalCode',
  ];

  const sampleRow = [
    'hosp-blr-01',
    'Victoria Govt Medical College & Hospital',
    'Govt Medical College Hospital',
    'Bengaluru Urban District',
    'Fort Road, Near City Market, Bengaluru - 560002',
    '+91 80-2670-1150',
    '108 / +91 80-2670-1199',
    'Open 24/7',
    '60',
    '45',
    '240',
    '180',
    '750',
    '640',
    '80',
    '55',
    '96',
    '4.7',
    'Dr. B. K. Ramesh (Medical Superintendent)',
    'YES',
    'National Health Portal (NHP) / Karnataka Health Directorate',
    '2026-10-30',
    'District Health Officer Bengaluru Urban',
    'YES',
    'KA-BEN-002',
  ];

  return [headers.join(','), sampleRow.join(',')].join('\r\n');
}
