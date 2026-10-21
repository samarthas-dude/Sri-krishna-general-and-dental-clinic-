import React, { useState } from 'react';
import { Appointment } from '../types';
import { formatDateDisplay, CLINIC_DISPLAY_PHONE, CLINIC_PHONE, CLINIC_ADDRESS } from '../utils/appointment';
import { X, Search, Calendar, Phone, MapPin, Bell, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming'>('all');

  if (!isOpen) return null;

  const filteredAppointments = appointments.filter((appt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      appt.id.toLowerCase().includes(q) ||
      appt.patientName.toLowerCase().includes(q) ||
      appt.patientPhone.includes(q) ||
      appt.serviceName.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#120f0d] border border-[#2e261d] rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#171411] border-b border-[#241f1a] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#c8a24d] block">
              Patient Portal & Reminders
            </span>
            <h2 className="font-serif text-2xl text-[#fdfaf3] font-normal mt-0.5">
              My Appointments & Reminders
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#78716c] hover:text-[#fdfaf3] hover:bg-[#201b16] transition-colors"
            aria-label="Close portal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-6 pb-2">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by phone number, booking ref (e.g. SKC-84920), or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#fdfaf3] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#a8a29e] pb-2 border-b border-[#1c1814]">
            <span>Showing {filteredAppointments.length} Bookings</span>
            <span className="text-[#c8a24d]">Direct Desk: {CLINIC_DISPLAY_PHONE}</span>
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-6 pt-2 max-h-[60vh] overflow-y-auto space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Calendar className="w-10 h-10 text-[#443b2f] mx-auto mb-3" />
              <h4 className="font-serif text-lg text-[#fdfaf3] font-normal">No Appointments Found</h4>
              <p className="text-xs text-[#78716c] max-w-sm mx-auto mt-1">
                We couldn&apos;t find any records matching your search query. You can book a new consultation anytime.
              </p>
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 rounded-xl bg-[#0c0a09] border border-[#262018] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1f1a14]">
                  <div>
                    <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">
                      Booking Reference
                    </span>
                    <span className="font-mono text-sm font-bold text-[#c8a24d]">
                      {appt.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
                          : 'bg-rose-950/40 border border-rose-800/40 text-rose-400'
                      }`}
                    >
                      {appt.status.toUpperCase()}
                    </span>

                    {appt.status === 'confirmed' && (
                      <button
                        onClick={() => onCancelAppointment(appt.id)}
                        className="text-xs text-[#78716c] hover:text-rose-400 p-1 transition-colors"
                        title="Cancel appointment"
                        aria-label={`Cancel appointment ${appt.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#78716c] block">Patient:</span>
                    <span className="text-[#fdfaf3] font-medium block mt-0.5">{appt.patientName}</span>
                    <span className="text-[#a8a29e]">{appt.patientPhone}</span>
                  </div>

                  <div>
                    <span className="text-[#78716c] block">Treatment:</span>
                    <span className="text-[#fdfaf3] font-medium block mt-0.5">{appt.serviceName}</span>
                    <span className="text-[#c8a24d]">{formatDateDisplay(appt.date)} at {appt.timeSlot}</span>
                  </div>
                </div>

                {/* Reminder status badges */}
                <div className="pt-2 border-t border-[#1a1612] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a8a29e]">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant confirmation sent via {appt.reminderChannel.toUpperCase()}</span>
                  </span>

                  <span className="text-[#78716c]">
                    Automated 24h & 2h alerts armed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#171411] border-t border-[#241f1a] flex items-center justify-between">
          <a
            href={`tel:${CLINIC_PHONE}`}
            className="text-xs text-[#c8a24d] hover:text-[#d8b76e] flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Need Help? Call Reception: {CLINIC_DISPLAY_PHONE}</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-[#241f1a] hover:bg-[#332b22] text-[#fdfaf3] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
