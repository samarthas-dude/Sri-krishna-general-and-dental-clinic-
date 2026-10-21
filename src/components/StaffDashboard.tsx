import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { CLINICAL_SERVICES, DOCTOR_DATA } from '../data/clinicData';
import {
  formatDateDisplay,
  getAvailableSlots,
  generateBookingId,
  CLINIC_NAME,
  CLINIC_DISPLAY_PHONE,
  CLINIC_PHONE,
  CLINIC_ADDRESS,
} from '../utils/appointment';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  ArrowLeft,
  Download,
  Printer,
  ChevronDown,
  Sparkles,
  Shield,
  Send,
  Trash2,
  Check,
} from 'lucide-react';

interface StaffDashboardProps {
  appointments: Appointment[];
  onBackToClinic: () => void;
  onUpdateStatus: (id: string, newStatus: Appointment['status'] | 'checked-in' | 'completed') => void;
  onAddNewBooking: (appointment: Appointment) => void;
  onDeleteBooking: (id: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  appointments,
  onBackToClinic,
  onUpdateStatus,
  onAddNewBooking,
  onDeleteBooking,
}) => {
  // Filter state
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'today' | 'tomorrow' | 'all' | 'custom'
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Walk-in / New Appointment Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState(CLINICAL_SERVICES[0].id);
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinSlot, setWalkinSlot] = useState('10:00 AM');
  const [walkinNotes, setWalkinNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Compute Today and Tomorrow dates in YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Date Filter
      if (dateFilter === 'today' && appt.date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && appt.date !== tomorrowStr) return false;
      if (dateFilter === 'custom' && appt.date !== customDate) return false;

      // Status Filter
      if (statusFilter !== 'all' && appt.status !== statusFilter) return false;

      // Category Filter
      if (categoryFilter !== 'all') {
        const srv = CLINICAL_SERVICES.find((s) => s.id === appt.serviceId);
        if (srv && srv.category !== categoryFilter) return false;
      }

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = appt.patientName.toLowerCase().includes(q);
        const matchesPhone = appt.patientPhone.includes(q);
        const matchesId = appt.id.toLowerCase().includes(q);
        const matchesService = appt.serviceName.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId && !matchesService) return false;
      }

      return true;
    });
  }, [appointments, dateFilter, customDate, todayStr, tomorrowStr, statusFilter, categoryFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const todayCount = appointments.filter((a) => a.date === todayStr).length;
    const morningCount = appointments.filter(
      (a) => a.date === todayStr && (a.timeSlot.includes('AM') || a.timeSlot.startsWith('12:'))
    ).length;
    const eveningCount = appointments.filter(
      (a) => a.date === todayStr && (a.timeSlot.includes('PM') && !a.timeSlot.startsWith('12:'))
    ).length;

    return { total, confirmed, todayCount, morningCount, eveningCount };
  }, [appointments, todayStr]);

  // Generate WhatsApp reminder link to patient
  const handleSendReminderWhatsApp = (appt: Appointment) => {
    const message = encodeURIComponent(
      `Namaste ${appt.patientName},\n\nThis is a friendly reminder from ${CLINIC_NAME} (Attibele).\n` +
      `Your consultation with ${DOCTOR_DATA.name} for ${appt.serviceName} is scheduled on:\n` +
      `📅 ${formatDateDisplay(appt.date)} at ${appt.timeSlot}\n` +
      `📍 Jayanna Complex, Jigala Road, Opp. Mayura Bakery, Attibele, Bengaluru.\n\n` +
      `Please reply with "CONFIRM" or call ${CLINIC_DISPLAY_PHONE} if you need to adjust your time slot.\nThank you!`
    );
    window.open(`https://wa.me/91${appt.patientPhone}?text=${message}`, '_blank');
    showToast(`WhatsApp reminder dispatched to ${appt.patientName} (${appt.patientPhone})`);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Booking ID,Patient Name,Phone,Email,Treatment,Date,Time Slot,Doctor,Status'];
    const rows = filteredAppointments.map((a) =>
      `"${a.id}","${a.patientName}","${a.patientPhone}","${a.patientEmail || ''}","${a.serviceName}","${a.date}","${a.timeSlot}","${a.doctorName}","${a.status}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SriKrishnaClinic_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Patient roster exported to CSV successfully.');
  };

  // Add walk-in booking
  const handleSaveWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) {
      alert('Please provide patient name and 10-digit mobile number.');
      return;
    }

    const srv = CLINICAL_SERVICES.find((s) => s.id === walkinServiceId) || CLINICAL_SERVICES[0];
    const newBooking: Appointment = {
      id: generateBookingId(),
      patientName: walkinName.trim(),
      patientPhone: walkinPhone.trim().replace(/\D/g, ''),
      patientEmail: walkinEmail.trim(),
      serviceId: srv.id,
      serviceName: srv.title,
      doctorName: DOCTOR_DATA.name,
      date: walkinDate,
      timeSlot: walkinSlot,
      notes: walkinNotes.trim() ? `[Walk-in / Front Desk] ${walkinNotes.trim()}` : '[Walk-in Patient]',
      reminderChannel: 'whatsapp',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      remindersSent: { immediate: true, dayBefore: false, twoHoursBefore: false },
    };

    onAddNewBooking(newBooking);
    setIsAddModalOpen(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinNotes('');
    showToast(`Appointment registered for ${newBooking.patientName} (${newBooking.id})`);
  };

  const walkinAvailableSlots = getAvailableSlots(walkinDate);

  return (
    <div className="min-h-screen bg-[#080706] text-[#e7e5e4] flex flex-col font-sans selection:bg-[#c8a24d]/30 selection:text-[#fdfaf3]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-[#141210] border border-[#c8a24d] shadow-2xl text-xs text-[#fdfaf3] flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#c8a24d] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Staff Top Navigation Bar */}
      <header className="bg-[#0f0d0b] border-b border-[#241f1a] px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToClinic}
              className="px-3 py-1.5 rounded-lg border border-[#2a241d] hover:border-[#c8a24d] text-xs font-medium text-[#d6d3d1] hover:text-[#fdfaf3] bg-[#141210] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>

            <div className="hidden sm:block h-4 w-[1px] bg-[#241f1a]" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base text-[#fdfaf3] font-semibold">
                  Reception & Staff Portal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#c8a24d]/15 text-[#c8a24d] border border-[#c8a24d]/30">
                  Staff View
                </span>
              </div>
              <span className="text-[11px] text-[#78716c] block">
                Sri Krishna Clinic · Attibele (Dr. Srinivasa.K, Licensed Dental Surgeon)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2e261e] text-xs font-medium text-[#a8a29e] hover:text-[#fdfaf3] hover:bg-[#1a1612] transition-colors cursor-pointer"
              title="Download CSV of filtered patient roster"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c8a24d] to-[#aa8233] hover:from-[#d8b76e] hover:to-[#b88f3e] text-[#0a0807] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#c8a24d]/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Patient / Walk-In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl bg-[#120f0d] border border-[#241f1a]">
            <span className="text-[11px] text-[#78716c] uppercase tracking-wider block">
              Today&apos;s Schedule ({new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-[#fdfaf3]">{stats.todayCount}</span>
              <span className="text-xs text-[#a8a29e]">Appointments</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#120f0d] border border-[#241f1a]">
            <span className="text-[11px] text-[#78716c] uppercase tracking-wider block">
              Morning Session (10 AM – 1 PM)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-[#c8a24d]">{stats.morningCount}</span>
              <span className="text-xs text-[#a8a29e]">Booked</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#120f0d] border border-[#241f1a]">
            <span className="text-[11px] text-[#78716c] uppercase tracking-wider block">
              Evening Session (5 PM – 9 PM)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-[#e2c482]">{stats.eveningCount}</span>
              <span className="text-xs text-[#a8a29e]">Booked</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#120f0d] border border-[#241f1a]">
            <span className="text-[11px] text-[#78716c] uppercase tracking-wider block">
              Total Active Bookings
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-[#fdfaf3]">{stats.total}</span>
              <span className="text-xs text-emerald-400">({stats.confirmed} Confirmed)</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-5 rounded-xl bg-[#120f0d] border border-[#241f1a] space-y-4">
          {/* Top row: Search and Quick Date tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient name, phone number, treatment, or booking ID (e.g. SKC-71924)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0807] border border-[#28221a] focus:border-[#c8a24d] rounded-lg pl-9 pr-4 py-2.5 text-xs text-[#fdfaf3] focus:outline-none"
              />
            </div>

            {/* Quick Date Filters */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0807] border border-[#241f1a] rounded-lg">
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  dateFilter === 'today'
                    ? 'bg-[#c8a24d] text-[#0a0807] font-semibold'
                    : 'text-[#a8a29e] hover:text-[#fdfaf3]'
                }`}
              >
                Today ({new Date().toLocaleDateString('en-US', { weekday: 'short' })})
              </button>
              <button
                onClick={() => setDateFilter('tomorrow')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  dateFilter === 'tomorrow'
                    ? 'bg-[#c8a24d] text-[#0a0807] font-semibold'
                    : 'text-[#a8a29e] hover:text-[#fdfaf3]'
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  dateFilter === 'all'
                    ? 'bg-[#c8a24d] text-[#0a0807] font-semibold'
                    : 'text-[#a8a29e] hover:text-[#fdfaf3]'
                }`}
              >
                All Dates
              </button>
              <div className="flex items-center gap-1 pl-1">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setDateFilter('custom');
                  }}
                  className="bg-[#141210] border border-[#2a241d] rounded px-2 py-1 text-xs text-[#fdfaf3] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bottom row: Category and Status Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1a1612] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#78716c]">Discipline:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0a0807] border border-[#2a241d] rounded px-2.5 py-1.5 text-xs text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
              >
                <option value="all">All Disciplines</option>
                <option value="preventive">Routine & Preventive</option>
                <option value="restorative">Restorative Dentistry</option>
                <option value="replacement">Tooth Replacement</option>
                <option value="orthodontics">Orthodontics & Aligners</option>
                <option value="oral-surgery">Oral Surgery & Gum Care</option>
                <option value="cosmetic">Cosmetic Dentistry</option>
              </select>

              <span className="text-[#78716c] ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0a0807] border border-[#2a241d] rounded px-2.5 py-1.5 text-xs text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <span className="text-[#a8a29e]">
              Showing <strong className="text-[#fdfaf3]">{filteredAppointments.length}</strong> of {appointments.length} records
            </span>
          </div>
        </div>

        {/* Patient Bookings Table */}
        <div className="rounded-xl overflow-hidden bg-[#120f0d] border border-[#241f1a] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#171411] border-b border-[#241f1a] text-[#78716c] uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-semibold">Ref & Patient</th>
                  <th className="py-3.5 px-4 font-semibold">Contact / Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Treatment Protocol</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time Slot</th>
                  <th className="py-3.5 px-4 font-semibold">Reminders & Alerts</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1612]">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-[#78716c]">
                      No booked appointments matching the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr
                      key={appt.id}
                      className="hover:bg-[#161310] transition-colors group"
                    >
                      {/* Ref & Patient */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] font-bold text-[#c8a24d]">
                            {appt.id}
                          </span>
                          <span className="font-medium text-[#fdfaf3] text-sm mt-0.5">
                            {appt.patientName}
                          </span>
                          {appt.notes && (
                            <span className="text-[10px] text-[#78716c] line-clamp-1 italic mt-0.5" title={appt.notes}>
                              {appt.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact / Phone */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`tel:${appt.patientPhone}`}
                            className="font-mono text-[#d6d3d1] hover:text-[#c8a24d] flex items-center gap-1.5"
                          >
                            <Phone className="w-3 h-3 text-[#c8a24d]" />
                            <span>+91 {appt.patientPhone}</span>
                          </a>
                          {appt.patientEmail && (
                            <span className="text-[11px] text-[#78716c] truncate max-w-[150px]">
                              {appt.patientEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Treatment Protocol */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#fdfaf3]">
                            {appt.serviceName}
                          </span>
                          <span className="text-[10px] text-[#78716c]">
                            Surgeon: {appt.doctorName}
                          </span>
                        </div>
                      </td>

                      {/* Date & Time Slot */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#fdfaf3]">
                            {formatDateDisplay(appt.date)}
                          </span>
                          <span className="text-[#c8a24d] font-semibold mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appt.timeSlot}
                          </span>
                        </div>
                      </td>

                      {/* Reminders & Alerts */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
                            <Check className="w-3 h-3" />
                            <span>Instant Ping: {appt.reminderChannel.toUpperCase()}</span>
                          </span>
                          <span className="block text-[10px] text-[#78716c]">
                            Auto 24h & 2h alerts armed
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={appt.status}
                          onChange={(e) => onUpdateStatus(appt.id, e.target.value as any)}
                          className={`text-xs px-2.5 py-1 rounded font-medium border focus:outline-none cursor-pointer ${
                            appt.status === 'confirmed'
                              ? 'bg-amber-950/30 text-amber-300 border-amber-800/40'
                              : appt.status === 'cancelled'
                              ? 'bg-rose-950/30 text-rose-300 border-rose-800/40'
                              : 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40'
                          }`}
                        >
                          <option value="confirmed" className="bg-[#120f0d] text-[#fdfaf3]">Confirmed</option>
                          <option value="checked-in" className="bg-[#120f0d] text-[#fdfaf3]">Checked In</option>
                          <option value="completed" className="bg-[#120f0d] text-[#fdfaf3]">Completed</option>
                          <option value="cancelled" className="bg-[#120f0d] text-[#fdfaf3]">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSendReminderWhatsApp(appt)}
                            className="p-1.5 rounded-lg bg-[#0e271a] border border-emerald-800/60 hover:border-emerald-500 text-emerald-300 text-xs transition-colors cursor-pointer flex items-center gap-1"
                            title="Send WhatsApp appointment reminder to patient"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline text-[11px]">Remind</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Remove appointment ${appt.id} for ${appt.patientName}?`)) {
                                onDeleteBooking(appt.id);
                                showToast(`Appointment ${appt.id} deleted.`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#78716c] hover:text-rose-400 hover:bg-[#201b16] transition-colors"
                            title="Delete booking record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Reception Add Walk-in Patient Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#141210] border border-[#2a241d] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-[#241f1a] mb-5">
              <div>
                <span className="text-[10px] text-[#c8a24d] uppercase font-bold tracking-wider block">
                  Front Desk Registration
                </span>
                <h3 className="font-serif text-2xl text-[#fdfaf3] font-normal mt-0.5">
                  Book Walk-in / Phone Patient
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded text-[#78716c] hover:text-[#fdfaf3]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWalkin} className="space-y-4 text-xs">
              <div>
                <label className="text-[#a8a29e] block mb-1 font-semibold">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Murthy"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a8a29e] block mb-1 font-semibold">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9262170318"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[#a8a29e] block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="patient@gmail.com"
                    value={walkinEmail}
                    onChange={(e) => setWalkinEmail(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a8a29e] block mb-1 font-semibold">Treatment / Discipline *</label>
                <select
                  value={walkinServiceId}
                  onChange={(e) => setWalkinServiceId(e.target.value)}
                  className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                >
                  {CLINICAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.categoryLabel || s.category}] {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a8a29e] block mb-1 font-semibold">Date *</label>
                  <input
                    type="date"
                    required
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[#a8a29e] block mb-1 font-semibold">Time Slot *</label>
                  <select
                    value={walkinSlot}
                    onChange={(e) => setWalkinSlot(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                  >
                    <optgroup label="Morning (10:00 AM – 1:00 PM)">
                      {walkinAvailableSlots.morning.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Evening (05:00 PM – 09:00 PM)">
                      {walkinAvailableSlots.evening.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#a8a29e] block mb-1">Reception Notes / Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Acute toothache, emergency scaling, referred by Dr..."
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#241f1a] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded border border-[#2e261e] text-[#a8a29e] hover:text-[#fdfaf3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold shadow-md"
                >
                  Save & Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
