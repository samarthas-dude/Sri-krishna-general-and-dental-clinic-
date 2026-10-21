export type ServiceCategory =
  | 'preventive'
  | 'restorative'
  | 'replacement'
  | 'orthodontics'
  | 'oral-surgery'
  | 'cosmetic'
  | 'aesthetics'
  | 'general';

export interface ClinicService {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  categoryLabel?: string;
  description: string;
  macroImage: string;
  duration: string;
  recoveryTime: string;
  benefits: string[];
  recommendedFor: string;
  startingPrice?: string;
}

export interface BeforeAfterCase {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
  duration: string;
  patientAge: string;
  description: string;
  tags: string[];
}

export interface Doctor {
  name: string;
  title: string;
  qualifications: string;
  experienceYears: number;
  image: string;
  about: string;
  specializations: string[];
  philosophies: string[];
  consultationFee: string;
  availability: string;
}

export interface Appointment {
  id: string; // e.g. SKC-84920
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  serviceId: string;
  serviceName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  notes?: string;
  reminderChannel: 'whatsapp' | 'sms' | 'email' | 'all';
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
  remindersSent: {
    immediate: boolean;
    dayBefore: boolean;
    twoHoursBefore: boolean;
  };
}

export interface ClinicTiming {
  day: string;
  shortDay: string;
  dayIndex: number; // 0 for Sunday, 1 for Monday, etc.
  morning: string;
  evening: string;
  isClosed: boolean;
  notes?: string;
}

export interface PatientReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  treatment: string;
  text: string;
  verified: boolean;
}
