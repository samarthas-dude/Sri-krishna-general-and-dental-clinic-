import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAvailableSlots,
  generateBookingId,
  isClinicOpenNow,
  validateAppointmentForm,
  generateIcsFile,
  generateGoogleCalendarUrl,
  parseTimeSlot,
} from './appointment';
import { Appointment } from '../types';
import { CLINICAL_SERVICES } from '../data/clinicData';

test('Sunday slot availability returns isClosed true and empty slots', () => {
  // 2026-10-25 is a Sunday
  const sundayResult = getAvailableSlots('2026-10-25');
  assert.equal(sundayResult.isClosed, true);
  assert.equal(sundayResult.morning.length, 0);
  assert.equal(sundayResult.evening.length, 0);
});

test('Saturday includes morning slots up to 1:00 PM (1:30 PM closing)', () => {
  // 2026-10-24 is a Saturday
  const satResult = getAvailableSlots('2026-10-24');
  assert.equal(satResult.isClosed, false);
  assert.ok(satResult.morning.includes('01:00 PM'));
  assert.ok(satResult.evening.includes('05:00 PM'));
  assert.ok(satResult.evening.includes('08:30 PM'));
});

test('Weekday morning and evening slots adhere to clinic timings', () => {
  // 2026-10-21 is a Wednesday
  const wedResult = getAvailableSlots('2026-10-21');
  assert.equal(wedResult.isClosed, false);
  assert.equal(wedResult.morning[0], '10:00 AM');
  assert.equal(wedResult.morning[wedResult.morning.length - 1], '12:30 PM');
  assert.equal(wedResult.evening[0], '05:00 PM');
  assert.equal(wedResult.evening[wedResult.evening.length - 1], '08:30 PM');
});

test('generateBookingId produces proper format', () => {
  const id = generateBookingId();
  assert.match(id, /^SKC-\d{5}$/);
});

test('parseTimeSlot parses AM and PM correctly', () => {
  assert.deepEqual(parseTimeSlot('10:30 AM'), { hour: 10, minute: 30 });
  assert.deepEqual(parseTimeSlot('12:00 PM'), { hour: 12, minute: 0 });
  assert.deepEqual(parseTimeSlot('05:30 PM'), { hour: 17, minute: 30 });
  assert.deepEqual(parseTimeSlot('08:00 PM'), { hour: 20, minute: 0 });
});

test('validateAppointmentForm checks required fields and formats', () => {
  // Empty data
  const invalid = validateAppointmentForm({
    patientName: '',
    patientPhone: '',
    patientEmail: 'invalid-email',
    date: '',
    timeSlot: '',
    serviceId: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.patientPhone);
  assert.ok(invalid.errors.patientEmail);
  assert.ok(invalid.errors.serviceId);
  assert.ok(invalid.errors.date);

  // Sunday selected
  const sundayCheck = validateAppointmentForm({
    patientName: 'John Doe',
    patientPhone: '9876543210',
    patientEmail: 'john@example.com',
    date: '2026-10-25', // Sunday
    timeSlot: '10:00 AM',
    serviceId: 'routine-checkup',
  });
  assert.equal(sundayCheck.isValid, false);
  assert.match(sundayCheck.errors.date, /closed on Sundays/i);

  // Valid appointment with newly added wisdom tooth removal service
  const valid = validateAppointmentForm({
    patientName: 'Jane Smith',
    patientPhone: '9262170318',
    patientEmail: 'jane@example.com',
    date: '2026-10-22',
    timeSlot: '05:00 PM',
    serviceId: 'wisdom-tooth-removal',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('clinical services dataset contains all requested treatments across 6 categories', () => {
  const serviceIds = CLINICAL_SERVICES.map((s) => s.id);
  // Preventive
  assert.ok(serviceIds.includes('routine-checkup'));
  assert.ok(serviceIds.includes('scaling-polishing'));
  assert.ok(serviceIds.includes('fluoride-treatments'));
  assert.ok(serviceIds.includes('pit-fissure-sealants'));
  // Restorative
  assert.ok(serviceIds.includes('composite-fillings'));
  assert.ok(serviceIds.includes('rct-restoration'));
  assert.ok(serviceIds.includes('crowns-bridges'));
  assert.ok(serviceIds.includes('inlays-onlays'));
  // Replacement
  assert.ok(serviceIds.includes('implant-fixture'));
  assert.ok(serviceIds.includes('fixed-partial-dentures'));
  assert.ok(serviceIds.includes('removable-dentures'));
  // Orthodontics
  assert.ok(serviceIds.includes('metal-braces'));
  assert.ok(serviceIds.includes('ceramic-braces'));
  assert.ok(serviceIds.includes('clear-aligners-full'));
  // Oral Surgery & Gum Care
  assert.ok(serviceIds.includes('simple-surgical-extractions'));
  assert.ok(serviceIds.includes('wisdom-tooth-removal'));
  assert.ok(serviceIds.includes('deep-scaling-root-planing'));
  assert.ok(serviceIds.includes('gum-surgeries'));
  // Cosmetic
  assert.ok(serviceIds.includes('teeth-whitening-bleaching'));
  assert.ok(serviceIds.includes('dental-veneers'));
  assert.ok(serviceIds.includes('digital-smile-makeover'));
});

test('generateIcsFile and Google Calendar URL output valid calendar formats', () => {
  const sampleAppointment: Appointment = {
    id: 'SKC-12345',
    patientName: 'Aarav Patel',
    patientPhone: '9262170318',
    patientEmail: 'aarav@example.com',
    serviceId: 'scaling-polishing',
    serviceName: 'Scaling and Polishing (Ultrasonic Cleaning)',
    doctorName: 'Dr. Srinivasa.K',
    date: '2026-10-23',
    timeSlot: '11:00 AM',
    reminderChannel: 'whatsapp',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    remindersSent: { immediate: true, dayBefore: false, twoHoursBefore: false },
  };

  const ics = generateIcsFile(sampleAppointment);
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('UID:SKC-12345@srikrishnaclinic.in'));
  assert.ok(ics.includes('Attibele'));
  assert.ok(ics.includes('Scaling and Polishing'));

  const gCalUrl = generateGoogleCalendarUrl(sampleAppointment);
  assert.ok(gCalUrl.startsWith('https://calendar.google.com/calendar/render'));
  assert.ok(gCalUrl.includes('action=TEMPLATE'));
});
