import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Edit3,
  X,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  ChevronRight,
  Send
} from 'lucide-react';

export const GovernmentDashboardView: React.FC = () => {
  const { hospitals, complaints, updateComplaintStatus, language, setActiveTab } = useApp();

  // Filters
  const [filterHospital, setFilterHospital] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected complaint for admin edit modal
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Under Review');
  const [officerName, setOfficerName] = useState<string>('Dr. Rajeshwar Sharma (District Health Officer)');
  const [actionNote, setActionNote] = useState<string>('');

  // Compute metrics
  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  ).length;
  const actionTakenCount = complaints.filter((c) => c.status === 'Action Taken').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

  // Category breakdown calculation
  const categoryCounts: Record<ComplaintCategory, number> = {
    'No Medicines': 0,
    'Poor Sanitation': 0,
    'Doctor Unavailability': 0,
    'Broken Equipment': 0,
    'Bed Shortage': 0,
    'Water Problems': 0,
    'Other': 0,
  };

  complaints.forEach((c) => {
    if (categoryCounts[c.category] !== undefined) {
      categoryCounts[c.category] += 1;
    } else {
      categoryCounts['Other'] += 1;
    }
  });

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    const matchesHosp = filterHospital === 'All' || c.hospitalName === filterHospital;
    const matchesCat = filterCategory === 'All' || c.category === filterCategory;
    const matchesStat = filterStatus === 'All' || c.status === filterStatus;
    const matchesQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesHosp && matchesCat && matchesStat && matchesQuery;
  });

  const handleOpenEditModal = (c: Complaint) => {
    setEditingComplaint(c);
    setNewStatus(c.status);
    setOfficerName(c.assignedOfficer || 'Dr. Rajeshwar Sharma (District Health Officer)');
    setActionNote(c.resolutionNote || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComplaint) {
      updateComplaintStatus(
        editingComplaint.id,
        newStatus,
        actionNote.trim() || `Status updated to ${newStatus} by District Health Grievance Wing.`,
        officerName.trim()
      );
      setEditingComplaint(null);
    }
  };

  const hospitalNames = ['All', ...Array.from(new Set(hospitals.map((h) => h.name)))];
  const categoriesList = ['All', 'No Medicines', 'Poor Sanitation', 'Doctor Unavailability', 'Broken Equipment', 'Bed Shortage', 'Water Problems', 'Other'];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Editorial Header */}
      <div className="bg-white p-6 sm:p-8 rounded border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0F2942] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>ADMINISTRATIVE OVERSIGHT · DISTRICT HEALTH COMMAND CONSOLE</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {language === 'kn' ? 'ಆಸ್ಪತ್ರೆಗಳ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ದೂರು ನಿರ್ವಹಣೆ' : 'Hospital Monitoring & Grievance Redressal'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {language === 'kn'
                ? 'ಕರ್ನಾಟಕ ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಆಡಳಿತ ಕೇಂದ್ರ. ಒಳಬರುವ ಸಾರ್ವಜನಿಕ ದೂರುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ತನಿಖಾಧಿಕಾರಿಗಳನ್ನು ನಿಯೋಜಿಸಿ ಹಾಗೂ ಪರಿಹಾರ ಕ್ರಮಗಳನ್ನು ಪ್ರಮಾಣೀಕರಿಸಿ.'
                : 'Karnataka District Health Administration central console. Track incoming citizen complaints, monitor facility bottleneck density, assign inquiry officers, and certify corrective remediation.'}
            </p>
          </div>

          {/* Admin Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded bg-[#0F2942] text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-slate-900">Dr. Rajeshwar Sharma</div>
              <div className="text-slate-600 text-[11px]">Chief Medical Officer · Karnataka Health Services</div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5 font-medium">
                ● Active Supervisory Session
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Metric Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0F2942]" />
            <span>Monitored Hospitals</span>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-2">{hospitals.length}</div>
          <div className="text-xs text-slate-500 mt-1 font-mono">Civil, Teaching &amp; PHCs</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Active Grievances</span>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900 mt-2">{totalComplaints}</div>
          <div className="text-xs text-amber-700 mt-1 font-mono font-semibold">
            {pendingCount} in queue
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Remediation In Progress</span>
          </div>
          <div className="text-3xl font-mono font-bold text-[#0F2942] mt-2">{actionTakenCount}</div>
          <div className="text-xs text-slate-500 mt-1 font-mono">On-site verification assigned</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolution Rate</span>
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-700 mt-2">
            {resolvedCount} <span className="text-base text-slate-500 font-normal">({resolutionRate}%)</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 font-mono font-medium">
            Benchmark: 80% within 7 days
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Category Distribution & Hospital Density */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-slate-900">
                Grievance Volume by Complaint Category
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">Distribution across public healthcare operational areas</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Consolidated Karnataka Dataset
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-900">
                    <span className="font-medium">{cat}</span>
                    <span className="font-mono tabular-nums text-slate-600">
                      <strong className="text-slate-900">{count}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#0F2942] rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hospital-wise Issue Density */}
        <div className="bg-white p-6 rounded border border-slate-200 space-y-4 shadow-xs">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-slate-900">Hospital Caseload</h3>
              <p className="text-xs text-slate-600 mt-0.5">Active grievance load by facility</p>
            </div>
            <button
              onClick={() => setActiveTab('gov-comm')}
              className="text-[11px] font-mono text-[#0F2942] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Dispatch Desk</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {hospitals.map((h) => {
              const hospComplaints = complaints.filter((c) => c.hospitalId === h.id);
              const openIssues = hospComplaints.filter((c) => c.status !== 'Resolved').length;

              return (
                <div
                  key={h.id}
                  className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-slate-900 truncate">{h.name}</div>
                    <div className="text-[11px] text-slate-600">{h.district}</div>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded border ${
                        openIssues > 0
                          ? 'border-amber-300 text-amber-800 bg-amber-50'
                          : 'border-emerald-200 text-emerald-800 bg-emerald-50'
                      }`}
                    >
                      {openIssues} Open
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {hospComplaints.length} Total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Complaints Management Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
        {/* Table Filters Header */}
        <div className="p-5 border-b border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#0F2942]" />
                <span>Hospital Complaints Registry &amp; Remediation Table</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Select any record to update official status, assign field inspectors, or attach resolution notes.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredComplaints.length} of {complaints.length} records
            </span>
          </div>

          {/* Search and Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-1 font-mono">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search docket ID or complainant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-hidden focus:bg-white focus:border-[#0F2942]"
              />
            </div>

            <select
              value={filterHospital}
              onChange={(e) => setFilterHospital(e.target.value)}
              aria-label="Filter complaints by hospital"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden font-sans"
            >
              {hospitalNames.map((h) => (
                <option key={h} value={h}>
                  Hospital: {h}
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter complaints by category"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden font-sans"
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter complaints by status"
              className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden font-sans"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted (Pending)</option>
              <option value="Under Review">Under Review</option>
              <option value="Action Taken">Action Taken</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4 font-semibold">Docket ID</th>
                <th className="py-3 px-4 font-semibold">Hospital &amp; Dept</th>
                <th className="py-3 px-4 font-semibold">Category &amp; Issue</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Complainant</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No grievances matching current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isPending = c.status === 'Submitted';
                  const isAction = c.status === 'Action Taken';
                  const isResolved = c.status === 'Resolved';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F2942] whitespace-nowrap">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{c.hospitalName}</div>
                        <div className="text-[11px] text-slate-600">{c.department}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-900">{c.category}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">{c.description}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            c.severity === 'Urgent'
                              ? 'border-rose-300 text-rose-800 bg-rose-50 font-bold'
                              : c.severity === 'High'
                              ? 'border-amber-300 text-amber-800 bg-amber-50'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                            isResolved
                              ? 'border-emerald-300 text-emerald-800 bg-emerald-50'
                              : isAction
                              ? 'border-amber-300 text-amber-800 bg-amber-50'
                              : isPending
                              ? 'border-[#0F2942]/30 text-[#0F2942] bg-slate-100'
                              : 'border-slate-300 text-slate-800 bg-slate-50'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-600">
                        <div className="text-slate-900 font-medium">{c.citizenName}</div>
                        <div className="font-mono text-[10px]">{c.citizenPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0F2942] text-slate-800 text-xs font-medium rounded transition-colors inline-flex items-center gap-1 font-mono"
                        >
                          <Edit3 className="w-3 h-3 text-[#0F2942]" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Grievance Review & Status Update Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 rounded border border-slate-200 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0F2942] font-semibold">
                  DISTRICT HEALTH OVERSIGHT
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                  Update Grievance #{editingComplaint.id}
                </h3>
                <p className="text-xs text-slate-600">
                  {editingComplaint.hospitalName} · {editingComplaint.category}
                </p>
              </div>

              <button
                onClick={() => setEditingComplaint(null)}
                aria-label="Close modal"
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-900 mb-1 font-mono text-[11px] uppercase">
                  Supervisory Investigation Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden font-mono"
                >
                  <option value="Submitted">Submitted (Awaiting Triage)</option>
                  <option value="Under Review">Under Review (Assigned to Inspector)</option>
                  <option value="Action Taken">Action Taken (Remediation Dispatched)</option>
                  <option value="Resolved">Resolved (Remediation Certified)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-1 font-mono text-[11px] uppercase">
                  Assigned District Health Officer / Inspector
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-900 mb-1 font-mono text-[11px] uppercase">
                  Official Remediation &amp; Finding Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Record on-ground findings, remedial instructions issued to hospital superintendent, and verification timeline..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-900 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="min-h-[40px] px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 bg-[#0F2942] hover:bg-[#1E3A8A] text-white font-medium text-xs font-mono rounded transition-colors shadow-xs"
                >
                  Save Status &amp; Update Public Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
