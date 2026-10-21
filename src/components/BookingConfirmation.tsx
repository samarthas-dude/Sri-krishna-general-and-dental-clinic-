import React, { useState } from 'react';
import { Appointment } from '../types';
import {
  formatDateDisplay,
  generateGoogleCalendarUrl,
  generateIcsFile,
  generateWhatsAppReminderUrl,
  calculateReminderTimeline,
  CLINIC_DISPLAY_PHONE,
  CLINIC_PHONE,
  CLINIC_ADDRESS,
  CLINIC_NAME,
} from '../utils/appointment';
import {
  CheckCircle2,
  Calendar,
  Download,
  MessageSquare,
  Bell,
  Clock,
  MapPin,
  Share2,
  PhoneCall,
  Check,
  Sparkles,
} from 'lucide-react';

interface BookingConfirmationProps {
  appointment: Appointment;
  onCloseModal: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointment,
  onCloseModal,
}) => {
  const [simulatedAlertSent, setSimulatedAlertSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const reminders = calculateReminderTimeline(appointment.date, appointment.timeSlot);
  const gCalUrl = generateGoogleCalendarUrl(appointment);
  const waUrl = generateWhatsAppReminderUrl(appointment);

  // Trigger .ics file download
  const handleDownloadIcs = () => {
    const icsContent = generateIcsFile(appointment);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${appointment.id}-SriKrishnaClinic.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSimulateAlert = () => {
    setSimulatedAlertSent(true);
    setTimeout(() => {
      setSimulatedAlertSent(false);
    }, 6000);
  };

  const handleCopySummary = () => {
    const text = `${CLINIC_NAME} - Booking ${appointment.id}\nPatient: ${appointment.patientName}\nTreatment: ${appointment.serviceName}\nDate: ${formatDateDisplay(appointment.date)} at ${appointment.timeSlot}\nLocation: ${CLINIC_ADDRESS}\nPhone: ${CLINIC_DISPLAY_PHONE}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Simulated Live Reminder Toast (When user clicks test button) */}
      {simulatedAlertSent && (
        <div className="p-4 rounded-xl bg-[#1e293b] border border-emerald-500/50 shadow-2xl animate-bounce text-xs text-[#f8fafc] flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-300">WhatsApp Notification Received</span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="mt-1 text-slate-300 leading-relaxed font-mono text-[11px]">
              &ldquo;Namaste {appointment.patientName}, your consultation at {CLINIC_NAME} is booked for {formatDateDisplay(appointment.date)} at {appointment.timeSlot}. Ref: {appointment.id}. Reply 1 to confirm, 2 to reschedule. Clinic: +91 92621 70318.&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Main Success Hero Banner */}
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-[#c8a24d]/15 border border-[#c8a24d]/40 flex items-center justify-center mx-auto mb-3 text-[#c8a24d]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold tracking-widest text-[#c8a24d] uppercase block">
          Consultation Confirmed
        </span>
        <h3 className="font-serif text-2xl text-[#fdfaf3] mt-1 font-normal">
          We look forward to welcoming you
        </h3>
        <p className="text-xs text-[#a8a29e] mt-1">
          A confirmation and reminder sequence has been scheduled for{' '}
          <strong className="text-[#fdfaf3]">{appointment.patientPhone}</strong>.
        </p>
      </div>

      {/* Booking Pass Card */}
      <div className="p-5 rounded-xl bg-[#0c0a09] border border-[#2a241d] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#241f1a]">
          <div>
            <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">
              Booking Reference
            </span>
            <span className="font-mono text-base font-bold text-[#c8a24d]">
              {appointment.id}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#78716c] uppercase tracking-wider block">
              Consulting Surgeon
            </span>
            <span className="text-xs font-medium text-[#fdfaf3]">
              {appointment.doctorName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#78716c] block">Treatment:</span>
            <span className="font-medium text-[#fdfaf3] text-sm block mt-0.5">
              {appointment.serviceName}
            </span>
          </div>

          <div>
            <span className="text-[#78716c] block">Date & Time:</span>
            <span className="font-medium text-[#c8a24d] text-sm block mt-0.5">
              {formatDateDisplay(appointment.date)} · {appointment.timeSlot}
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-[#1c1814] flex items-start gap-2 text-[#a8a29e]">
            <MapPin className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              {CLINIC_ADDRESS} (Opp. Mayura Bakery, Jayanna Complex)
            </span>
          </div>
        </div>
      </div>

      {/* Automated Reminders Schedule */}
      <div className="p-4 rounded-xl bg-[#141210] border border-[#262018]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#c8a24d] uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            <span>Automated Reminder Timeline</span>
          </div>
          <button
            onClick={handleSimulateAlert}
            className="text-[11px] text-[#c8a24d] hover:text-[#d8b76e] underline-offset-4 hover:underline cursor-pointer flex items-center gap-1"
            title="Preview instant automated notification"
          >
            <Sparkles className="w-3 h-3" />
            <span>Test Reminder Trigger</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Step 1: Immediate */}
          <div className="flex items-start gap-3 text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px]">
              ✓
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#fdfaf3]">{reminders.immediate.type}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{reminders.immediate.status}</span>
              </div>
              <p className="text-[11px] text-[#78716c] mt-0.5">{reminders.immediate.message}</p>
            </div>
          </div>

          {/* Step 2: 24h Before */}
          <div className="flex items-start gap-3 text-xs">
            <div className="w-5 h-5 rounded-full bg-[#1c1814] border border-[#332a20] text-[#c8a24d] flex items-center justify-center shrink-0 text-[10px]">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#d6d3d1]">{reminders.dayBefore.type}</span>
                <span className="text-[10px] text-[#a8a29e]">{reminders.dayBefore.date}</span>
              </div>
              <p className="text-[11px] text-[#78716c] mt-0.5">{reminders.dayBefore.message}</p>
            </div>
          </div>

          {/* Step 3: 2h Before */}
          <div className="flex items-start gap-3 text-xs">
            <div className="w-5 h-5 rounded-full bg-[#1c1814] border border-[#332a20] text-[#c8a24d] flex items-center justify-center shrink-0 text-[10px]">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#d6d3d1]">{reminders.twoHoursBefore.type}</span>
                <span className="text-[10px] text-[#a8a29e]">{reminders.twoHoursBefore.date}</span>
              </div>
              <p className="text-[11px] text-[#78716c] mt-0.5">{reminders.twoHoursBefore.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar & WhatsApp Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href={gCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-[#141210] border border-[#2a241d] hover:border-[#c8a24d] text-xs font-medium text-[#f5f2ec] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-4 h-4 text-[#c8a24d]" />
          <span>Add to Google Calendar</span>
        </a>

        <button
          onClick={handleDownloadIcs}
          className="p-3 rounded-lg bg-[#141210] border border-[#2a241d] hover:border-[#c8a24d] text-xs font-medium text-[#f5f2ec] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#c8a24d]" />
          <span>Download .iCal / Apple Pass</span>
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-[#0e271a] border border-emerald-800/60 hover:border-emerald-500 text-xs font-semibold text-emerald-300 transition-colors flex items-center justify-center gap-2 sm:col-span-2"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Open Direct WhatsApp to {CLINIC_DISPLAY_PHONE}</span>
        </a>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#241f1a]">
        <button
          onClick={handleCopySummary}
          className="text-xs text-[#a8a29e] hover:text-[#fdfaf3] flex items-center gap-1.5 cursor-pointer"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Copied to Clipboard' : 'Copy Appointment Details'}</span>
        </button>

        <button
          onClick={onCloseModal}
          className="px-6 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
