import { Appointment, ClinicTiming } from '../types';

export const CLINIC_PHONE = '9262170318';
export const CLINIC_DISPLAY_PHONE = '+91 92621 70318';
export const CLINIC_ADDRESS = 'Jayanna Complex, St. Dominics School Road, Jigala Cross, Jigala Road, Opp Mayura Bakery, Sarjapura Road, Attibele, Anekal Taluk, Bengaluru, Karnataka 562107';
export const CLINIC_NAME = 'Sri Krishna General and Dental Clinic';

export const CLINIC_WEEKLY_TIMINGS: ClinicTiming[] = [
  { day: 'Sunday', shortDay: 'Sun', dayIndex: 0, morning: 'Closed', evening: 'Closed', isClosed: true },
  { day: 'Monday', shortDay: 'Mon', dayIndex: 1, morning: '10:00 AM – 1:00 PM', evening: '5:00 PM – 9:00 PM', isClosed: false, notes: 'Pargat Diwas (Hours might differ)' },
  { day: 'Tuesday', shortDay: 'Tue', dayIndex: 2, morning: '10:00 AM – 1:00 PM', evening: '5:00 PM – 9:00 PM', isClosed: false },
  { day: 'Wednesday', shortDay: 'Wed', dayIndex: 3, morning: '10:00 AM – 1:00 PM', evening: '5:00 PM – 9:00 PM', isClosed: false },
  { day: 'Thursday', shortDay: 'Thu', dayIndex: 4, morning: '10:00 AM – 1:00 PM', evening: '5:00 PM – 9:00 PM', isClosed: false },
  { day: 'Friday', shortDay: 'Fri', dayIndex: 5, morning: '10:00 AM – 1:00 PM', evening: '5:00 PM – 9:00 PM', isClosed: false },
  { day: 'Saturday', shortDay: 'Sat', dayIndex: 6, morning: '10:00 AM – 1:30 PM', evening: '5:00 PM – 9:00 PM', isClosed: false, notes: 'Extended morning hours till 1:30 PM' },
];

/**
 * Returns list of available 30-min consultation time slots for a given date
 * Respects clinic hours:
 * - Sunday: Closed
 * - Saturday: 10:00 AM - 1:30 PM (morning), 5:00 PM - 9:00 PM (evening)
 * - Weekdays: 10:00 AM - 1:00 PM (morning), 5:00 PM - 9:00 PM (evening)
 */
export function getAvailableSlots(dateString: string): { morning: string[]; evening: string[]; isClosed: boolean } {
  if (!dateString) {
    return { morning: [], evening: [], isClosed: false };
  }

  // Parse YYYY-MM-DD
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return { morning: [], evening: [], isClosed: false };
  }
  
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const dayIndex = date.getDay(); // 0 is Sunday, 6 is Saturday

  if (dayIndex === 0) {
    // Sunday is closed
    return { morning: [], evening: [], isClosed: true };
  }

  const morning: string[] = [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
  ];

  if (dayIndex === 6) {
    // Saturday open until 1:30 PM
    morning.push('01:00 PM');
  }

  const evening: string[] = [
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
  ];

  return {
    morning,
    evening,
    isClosed: false,
  };
}

/**
 * Checks if the clinic is currently open based on current local time
 */
export function isClinicOpenNow(currentDate: Date = new Date()): { isOpen: boolean; statusText: string; nextOpenTime: string } {
  const day = currentDate.getDay(); // 0 = Sun
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  if (day === 0) {
    return {
      isOpen: false,
      statusText: 'Closed today (Sunday)',
      nextOpenTime: 'Opens Monday at 10:00 AM',
    };
  }

  const morningStart = 10 * 60; // 10:00 AM = 600 min
  const morningEnd = day === 6 ? 13 * 60 + 30 : 13 * 60; // 1:30 PM on Sat (810 min), 1:00 PM (780 min)
  const eveningStart = 17 * 60; // 5:00 PM = 1020 min
  const eveningEnd = 21 * 60; // 9:00 PM = 1260 min

  if (currentMinutes >= morningStart && currentMinutes < morningEnd) {
    return {
      isOpen: true,
      statusText: 'Open now · Morning Session',
      nextOpenTime: `Morning session closes at ${day === 6 ? '1:30 PM' : '1:00 PM'}`,
    };
  }

  if (currentMinutes >= eveningStart && currentMinutes < eveningEnd) {
    return {
      isOpen: true,
      statusText: 'Open now · Evening Session',
      nextOpenTime: 'Evening session closes at 9:00 PM',
    };
  }

  if (currentMinutes < morningStart) {
    return {
      isOpen: false,
      statusText: 'Opens at 10:00 AM',
      nextOpenTime: 'Morning session: 10:00 AM – 1:00 PM',
    };
  }

  if (currentMinutes >= morningEnd && currentMinutes < eveningStart) {
    return {
      isOpen: false,
      statusText: 'Midday Break · Opens at 5:00 PM',
      nextOpenTime: 'Evening session: 5:00 PM – 9:00 PM',
    };
  }

  return {
    isOpen: false,
    statusText: 'Closed for the day',
    nextOpenTime: 'Opens tomorrow at 10:00 AM',
  };
}

/**
 * Generates an appointment reference ID (e.g. SKC-84920)
 */
export function generateBookingId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SKC-${randomNum}`;
}

/**
 * Format date nicely: "2026-10-24" -> "Saturday, Oct 24, 2026"
 */
export function formatDateDisplay(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3) return dateString;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Parses time slot "10:30 AM" or "05:30 PM" to { hour: number, minute: number } in 24h
 */
export function parseTimeSlot(timeSlot: string): { hour: number; minute: number } {
  const [time, meridiem] = timeSlot.trim().split(' ');
  const [h, m] = time.split(':').map(Number);
  let hour = h;
  if (meridiem?.toUpperCase() === 'PM' && hour < 12) hour += 12;
  if (meridiem?.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return { hour, minute: m || 0 };
}

/**
 * Generates automated reminder timeline dates/labels
 */
export function calculateReminderTimeline(dateString: string, timeSlot: string) {
  const parts = dateString.split('-').map(Number);
  const { hour, minute } = parseTimeSlot(timeSlot);
  const apptDate = new Date(parts[0], parts[1] - 1, parts[2], hour, minute);

  const dayBefore = new Date(apptDate.getTime() - 24 * 60 * 60 * 1000);
  const twoHoursBefore = new Date(apptDate.getTime() - 2 * 60 * 60 * 1000);

  return {
    immediate: {
      type: 'Immediate Confirmation',
      message: 'Booking details, doctor credentials, and clinic address pin sent instantly.',
      status: 'Sent on Confirmation',
    },
    dayBefore: {
      type: '24-Hour Prior Reminder',
      date: dayBefore.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      message: 'Appointment schedule reminder with fasting/preparation protocol if applicable.',
      status: 'Scheduled',
    },
    twoHoursBefore: {
      type: '2-Hour Route & Arrival Alert',
      date: twoHoursBefore.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      message: 'Live traffic guide to Jayanna Complex, Attibele, with direct reception desk ring.',
      status: 'Scheduled',
    },
  };
}

/**
 * Generates an .ics calendar file for the appointment
 */
export function generateIcsFile(appointment: Appointment): string {
  const parts = appointment.date.split('-').map(Number);
  const { hour, minute } = parseTimeSlot(appointment.timeSlot);
  
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Format as YYYYMMDDTHHMMSS
  const startStr = `${parts[0]}${pad(parts[1])}${pad(parts[2])}T${pad(hour)}${pad(minute)}00`;
  
  // 45 min duration
  const endMinTotal = minute + 45;
  const endHour = hour + Math.floor(endMinTotal / 60);
  const endMinute = endMinTotal % 60;
  const endStr = `${parts[0]}${pad(parts[1])}${pad(parts[2])}T${pad(endHour)}${pad(endMinute)}00`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sri Krishna General and Dental Clinic//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@srikrishnaclinic.in`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${appointment.serviceName} - Sri Krishna Clinic`,
    `DESCRIPTION:Appointment Ref: ${appointment.id}\\nPatient: ${appointment.patientName}\\nService: ${appointment.serviceName}\\nDoctor: ${appointment.doctorName}\\nPhone: +91 92621 70318`,
    `LOCATION:${CLIC_ESCAPE(CLINIC_ADDRESS)}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Clinic Appointment Tomorrow',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Clinic Appointment in 2 Hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

function CLIC_ESCAPE(str: string): string {
  return str.replace(/,/g, '\\,').replace(/;/g, '\\;');
}

/**
 * Creates Google Calendar URL
 */
export function generateGoogleCalendarUrl(appointment: Appointment): string {
  const parts = appointment.date.split('-').map(Number);
  const { hour, minute } = parseTimeSlot(appointment.timeSlot);
  
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const startStr = `${parts[0]}${pad(parts[1])}${pad(parts[2])}T${pad(hour)}${pad(minute)}00`;
  
  const endMinTotal = minute + 45;
  const endHour = hour + Math.floor(endMinTotal / 60);
  const endMinute = endMinTotal % 60;
  const endStr = `${parts[0]}${pad(parts[1])}${pad(parts[2])}T${pad(endHour)}${pad(endMinute)}00`;

  const title = encodeURIComponent(`${appointment.serviceName} · Sri Krishna Clinic`);
  const details = encodeURIComponent(
    `Appointment Reference: ${appointment.id}\nPatient: ${appointment.patientName}\nDoctor: ${appointment.doctorName}\nPhone: ${CLINIC_DISPLAY_PHONE}\nClinic: ${CLINIC_NAME}`
  );
  const location = encodeURIComponent(CLINIC_ADDRESS);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

/**
 * Generates direct WhatsApp message URL to clinic phone
 */
export function generateWhatsAppReminderUrl(appointment: Appointment, clinicPhone: string = CLINIC_PHONE): string {
  const text = encodeURIComponent(
    `Hello Sri Krishna Clinic,\n\nI have booked an appointment (Ref: ${appointment.id}).\n` +
    `• Patient: ${appointment.patientName}\n` +
    `• Service: ${appointment.serviceName}\n` +
    `• Date & Time: ${formatDateDisplay(appointment.date)} at ${appointment.timeSlot}\n` +
    `• Contact: ${appointment.patientPhone}\n\n` +
    `Please confirm my slot. Thank you!`
  );
  return `https://wa.me/91${clinicPhone}?text=${text}`;
}

/**
 * Form validation helper
 */
export function validateAppointmentForm(data: {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  serviceId: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = 'Please enter your full name (minimum 2 characters).';
  }

  // Clean phone digits
  const cleanPhone = (data.patientPhone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.patientPhone = 'Please enter a valid 10-digit mobile number.';
  }

  if (data.patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patientEmail)) {
    errors.patientEmail = 'Please enter a valid email address.';
  }

  if (!data.serviceId) {
    errors.serviceId = 'Please select a clinical service.';
  }

  if (!data.date) {
    errors.date = 'Please select an appointment date.';
  } else {
    const slots = getAvailableSlots(data.date);
    if (slots.isClosed) {
      errors.date = 'The clinic is closed on Sundays. Please select Monday through Saturday.';
    }
  }

  if (!data.timeSlot) {
    errors.timeSlot = 'Please select a consultation time slot.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
