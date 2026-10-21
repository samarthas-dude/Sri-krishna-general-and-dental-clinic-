import React, { useState, useEffect } from 'react';
import { CLINICAL_SERVICES, DOCTOR_DATA } from '../data/clinicData';
import { Appointment, ServiceCategory } from '../types';
import {
  getAvailableSlots,
  generateBookingId,
  validateAppointmentForm,
  formatDateDisplay,
  CLINIC_PHONE,
  CLINIC_DISPLAY_PHONE,
} from '../utils/appointment';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bell,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  onAppointmentCreated: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  onAppointmentCreated,
}) => {
  // Steps: 1: Service, 2: Date & Slot, 3: Patient Info, 4: Confirmation & Reminders
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || CLINICAL_SERVICES[0].id
  );
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  
  // Initialize date to next available working day (skip Sunday)
  const getInitialDate = () => {
    const d = new Date();
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1); // skip to Monday
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientNotes, setPatientNotes] = useState<string>('');
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'sms' | 'email' | 'all'>('whatsapp');
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Update preselected service if passed
  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      // Ensure we switch to that service's category so it's visible if user changes filter
      const found = CLINICAL_SERVICES.find((s) => s.id === preselectedServiceId);
      if (found) {
        setActiveCategoryFilter(found.category);
      }
    }
  }, [preselectedServiceId]);

  if (!isOpen) return null;

  // Filter clinical services by category and search
  const filteredServices = CLINICAL_SERVICES.filter((srv) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || srv.category === activeCategoryFilter;
    const q = serviceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      srv.title.toLowerCase().includes(q) ||
      srv.subtitle.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q) ||
      (srv.categoryLabel && srv.categoryLabel.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Calculate slots for current selected date
  const slotData = getAvailableSlots(selectedDate);
  const selectedService = CLINICAL_SERVICES.find((s) => s.id === selectedServiceId) || CLINICAL_SERVICES[0];

  const categoryTabs = [
    { id: 'all', label: 'All Treatments' },
    { id: 'preventive', label: 'Routine & Preventive' },
    { id: 'restorative', label: 'Restorative Dentistry' },
    { id: 'replacement', label: 'Tooth Replacement' },
    { id: 'orthodontics', label: 'Orthodontics & Aligners' },
    { id: 'oral-surgery', label: 'Oral Surgery & Gums' },
    { id: 'cosmetic', label: 'Cosmetic Dentistry' },
  ];

  // Quick 10-day date chips
  const generateUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateString = `${y}-${m}-${dayNum}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfMonth = d.getDate();
      const isSunday = d.getDay() === 0;

      days.push({
        dateString,
        dayName,
        dayOfMonth,
        isSunday,
      });
    }
    return days;
  };

  const upcomingDays = generateUpcomingDays();

  const handleNextToStep2 = () => {
    setStep(2);
  };

  const handleNextToStep3 = () => {
    if (!selectedSlot) {
      setFormErrors({ timeSlot: 'Please choose an available morning or evening time slot.' });
      return;
    }
    setFormErrors({});
    setStep(3);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAppointmentForm({
      patientName,
      patientPhone,
      patientEmail,
      date: selectedDate,
      timeSlot: selectedSlot,
      serviceId: selectedServiceId,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const newAppointment: Appointment = {
      id: generateBookingId(),
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      doctorName: DOCTOR_DATA.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes: patientNotes.trim(),
      reminderChannel,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      remindersSent: {
        immediate: true,
        dayBefore: false,
        twoHoursBefore: false,
      },
    };

    // Save and elevate
    onAppointmentCreated(newAppointment);
    setConfirmedAppointment(newAppointment);
    setStep(4);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#120f0d] border border-[#2e261d] rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#171411] border-b border-[#241f1a] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[#c8a24d]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sri Krishna Clinic · Patient Scheduling</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#fdfaf3] font-normal mt-0.5">
              {step === 4 ? 'Appointment Confirmed' : 'Book a Clinical Consultation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#78716c] hover:text-[#fdfaf3] hover:bg-[#201b16] transition-colors"
            aria-label="Close scheduling modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators (Zero-pill, clean typographic steps) */}
        {step < 4 && (
          <div className="px-6 py-3 bg-[#0d0b09] border-b border-[#1f1a14] flex items-center justify-between text-xs text-[#78716c]">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#c8a24d] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#c8a24d] text-black font-bold' : 'border border-[#332a20]'}`}>
                1
              </span>
              <span>1. Select Treatment</span>
            </div>
            <span className="text-[#332a20]">———</span>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#c8a24d] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#c8a24d] text-black font-bold' : 'border border-[#332a20]'}`}>
                2
              </span>
              <span>2. Date & Time</span>
            </div>
            <span className="text-[#332a20]">———</span>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#c8a24d] font-semibold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#c8a24d] text-black font-bold' : 'border border-[#332a20]'}`}>
                3
              </span>
              <span>3. Patient Details</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: SELECT TREATMENT */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Search & Category Filter Controls */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search treatment e.g. root canal, wisdom tooth, cleaning, braces, aligners, fillings..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-9 pr-4 py-2 text-xs text-[#fdfaf3] focus:outline-none"
                    />
                  </div>
                  {serviceSearch && (
                    <button
                      type="button"
                      onClick={() => setServiceSearch('')}
                      className="text-xs text-[#a8a29e] hover:text-[#fdfaf3] px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Buttons (Constitutional Segmented Tabs) */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0807] border border-[#241f1a] rounded-lg">
                  {categoryTabs.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                        activeCategoryFilter === cat.id
                          ? 'bg-[#c8a24d] text-[#0a0807] font-semibold shadow-sm'
                          : 'text-[#a8a29e] hover:text-[#fdfaf3] hover:bg-[#1a1714]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatment Cards Grid */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#a8a29e] mb-2.5">
                  <span>Showing {filteredServices.length} Treatments</span>
                  {selectedService && (
                    <span className="text-[#c8a24d]">
                      Selected: <strong>{selectedService.title}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {filteredServices.length === 0 ? (
                    <div className="sm:col-span-2 text-center py-8 text-xs text-[#78716c]">
                      No treatments matching &quot;{serviceSearch}&quot;. Try selecting &quot;All Treatments&quot; above.
                    </div>
                  ) : (
                    filteredServices.map((srv) => {
                      const isSelected = selectedServiceId === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedServiceId(srv.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1a1612] border-[#c8a24d] shadow-md ring-1 ring-[#c8a24d]/30'
                              : 'bg-[#0f0d0b] border-[#262018] hover:border-[#3d3326] hover:bg-[#141210]'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] text-[#c8a24d] uppercase tracking-wider font-semibold block">
                                  {srv.categoryLabel || srv.category}
                                </span>
                                <h4 className={`font-serif text-base font-normal mt-0.5 ${isSelected ? 'text-[#fdfaf3]' : 'text-[#d6d3d1]'}`}>
                                  {srv.title}
                                </h4>
                              </div>
                              {isSelected && <CheckCircle className="w-4 h-4 text-[#c8a24d] shrink-0 mt-1" />}
                            </div>

                            <p className="text-xs text-[#a8a29e] mt-1.5 line-clamp-2 font-light leading-relaxed">
                              {srv.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[#1a1612] text-[11px] text-[#c8a24d] font-medium flex items-center justify-between">
                            <span className="text-[#78716c] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#c8a24d]" />
                              {srv.duration}
                            </span>
                            <span>{srv.startingPrice}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Consulting Doctor Preview Strip */}
              <div className="p-3.5 rounded-xl bg-[#0c0a09] border border-[#241f1a] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={DOCTOR_DATA.image}
                    alt={DOCTOR_DATA.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#c8a24d]/40"
                  />
                  <div className="text-xs">
                    <span className="text-[#fdfaf3] font-medium block">{DOCTOR_DATA.name}</span>
                    <span className="text-[#a8a29e] text-[11px]">{DOCTOR_DATA.title} · 25+ Yrs Licensed Practice</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextToStep2}
                  className="px-6 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <span>Select Date & Slot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOT PICKER */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold block mb-2">
                  Select Appointment Date:
                </label>

                {/* Quick Date Selector Chips */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {upcomingDays.map((d) => {
                    const isSelected = selectedDate === d.dateString;
                    return (
                      <button
                        key={d.dateString}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.dateString);
                          setSelectedSlot('');
                          setFormErrors({});
                        }}
                        className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#c8a24d] border-[#c8a24d] text-black shadow-md'
                            : d.isSunday
                            ? 'bg-[#0f0d0b] border-[#221c16] text-[#554e47] opacity-60'
                            : 'bg-[#141210] border-[#262018] text-[#d6d3d1] hover:border-[#3d3326]'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-black' : d.isSunday ? 'text-[#776c61]' : 'text-[#a8a29e]'}`}>
                          {d.dayName}
                        </span>
                        <span className={`text-base font-serif font-semibold block ${isSelected ? 'text-black' : 'text-[#fdfaf3]'}`}>
                          {d.dayOfMonth}
                        </span>
                        {d.isSunday && (
                          <span className="text-[9px] text-amber-500 block font-medium">Closed</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Fallback Date Input */}
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-[#c8a24d]" />
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot('');
                      setFormErrors({});
                    }}
                    className="bg-[#0f0d0b] border border-[#2a241d] rounded px-3 py-1.5 text-xs text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                  />
                  <span className="text-xs text-[#a8a29e]">
                    Selected: <strong className="text-[#fdfaf3]">{formatDateDisplay(selectedDate)}</strong>
                  </span>
                </div>
              </div>

              {/* Sunday Closed Warning */}
              {slotData.isClosed ? (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-amber-200">Clinic is Closed on Sundays</h5>
                    <p className="mt-1 text-amber-300/80 leading-relaxed">
                      Sri Krishna Clinic operates Monday through Saturday (Morning 10 AM–1 PM, Evening 5 PM–9 PM). Please choose another date above to view available consultation slots.
                    </p>
                  </div>
                </div>
              ) : (
                /* Available Slots */
                <div className="space-y-4 pt-2">
                  {/* Morning Slots */}
                  <div>
                    <span className="text-xs font-semibold text-[#c8a24d] uppercase tracking-wider block mb-2">
                      Morning Session (10:00 AM – {new Date(selectedDate).getDay() === 6 ? '1:30 PM' : '1:00 PM'})
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slotData.morning.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot);
                              setFormErrors({});
                            }}
                            className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#c8a24d] border-[#c8a24d] text-black font-semibold shadow-md'
                                : 'bg-[#141210] border-[#28221a] text-[#d6d3d1] hover:border-[#c8a24d]/50 hover:bg-[#1a1714]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Evening Slots */}
                  <div>
                    <span className="text-xs font-semibold text-[#c8a24d] uppercase tracking-wider block mb-2">
                      Evening Session (05:00 PM – 09:00 PM)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slotData.evening.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot);
                              setFormErrors({});
                            }}
                            className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#c8a24d] border-[#c8a24d] text-black font-semibold shadow-md'
                                : 'bg-[#141210] border-[#28221a] text-[#d6d3d1] hover:border-[#c8a24d]/50 hover:bg-[#1a1714]'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {formErrors.timeSlot && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.timeSlot}
                </p>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#241f1a]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded border border-[#2e261e] text-xs text-[#a8a29e] hover:text-[#fdfaf3] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Treatments</span>
                </button>

                <button
                  type="button"
                  disabled={slotData.isClosed || !selectedSlot}
                  onClick={handleNextToStep3}
                  className={`px-6 py-2.5 rounded text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
                    slotData.isClosed || !selectedSlot
                      ? 'bg-[#221c16] text-[#554e47] cursor-not-allowed'
                      : 'bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] shadow-md cursor-pointer'
                  }`}
                >
                  <span>Enter Patient Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT CONTACT & AUTOMATED REMINDERS PREFERENCE */}
          {step === 3 && (
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              {/* Summary pill */}
              <div className="p-3.5 rounded-lg bg-[#0c0a09] border border-[#241f1a] text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[#78716c]">Treatment: </span>
                  <strong className="text-[#fdfaf3]">{selectedService.title}</strong>
                </div>
                <div className="text-[#c8a24d] font-medium">
                  {formatDateDisplay(selectedDate)} at {selectedSlot}
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold block mb-1.5">
                  Patient Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#fdfaf3] focus:outline-none"
                  />
                </div>
                {formErrors.patientName && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.patientName}</p>
                )}
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold block mb-1.5">
                    Phone (WhatsApp Active) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-xs text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="9262170318"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-12 pr-4 py-2.5 text-xs text-[#fdfaf3] focus:outline-none font-mono"
                    />
                  </div>
                  {formErrors.patientPhone && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.patientPhone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold block mb-1.5">
                    Email Address (Calendar Invite)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#fdfaf3] focus:outline-none"
                    />
                  </div>
                  {formErrors.patientEmail && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.patientEmail}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#a8a29e] font-semibold block mb-1.5">
                  Specific Concerns / Dental Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mild pain in upper molar, interested in tooth-colored fillings or clear aligners..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full bg-[#0a0807] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg px-3 py-2 text-xs text-[#fdfaf3] focus:outline-none resize-none"
                />
              </div>

              {/* Automated Reminder Channels */}
              <div className="p-4 rounded-xl bg-[#0e0c0a] border border-[#262018]">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#c8a24d] uppercase tracking-wider">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Automated Confirmation & Reminder Triggers</span>
                </div>
                <p className="text-[11px] text-[#a8a29e] leading-relaxed mb-3">
                  We send instant confirmation, a 24-hour preparatory briefing, and a 2-hour arrival route alert to keep your schedule seamless.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', desc: 'Instant + Ping' },
                    { id: 'sms', label: 'SMS Alert', desc: 'Direct text' },
                    { id: 'email', label: 'Email + .ICS', desc: 'Calendar synch' },
                    { id: 'all', label: 'All Channels', desc: 'Maximum peace' },
                  ].map((ch) => (
                    <label
                      key={ch.id}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                        reminderChannel === ch.id
                          ? 'bg-[#1f1a14] border-[#c8a24d] text-[#fdfaf3]'
                          : 'bg-[#0a0807] border-[#221c16] text-[#78716c] hover:border-[#383023]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reminderChannel"
                        value={ch.id}
                        checked={reminderChannel === ch.id}
                        onChange={() => setReminderChannel(ch.id as any)}
                        className="sr-only"
                      />
                      <span className="font-semibold block text-[11px]">{ch.label}</span>
                      <span className="text-[9px] text-[#a8a29e] block mt-0.5">{ch.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation and Submit */}
              <div className="flex items-center justify-between pt-4 border-t border-[#241f1a]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded border border-[#2e261e] text-xs text-[#a8a29e] hover:text-[#fdfaf3] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Slots</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded bg-gradient-to-r from-[#c8a24d] to-[#aa8233] hover:from-[#d8b76e] hover:to-[#b88f3e] text-[#0a0807] font-semibold text-xs tracking-wide shadow-xl shadow-[#c8a24d]/15 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm & Activate Reminders</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION & AUTOMATED REMINDERS DASHBOARD */}
          {step === 4 && confirmedAppointment && (
            <BookingConfirmation
              appointment={confirmedAppointment}
              onCloseModal={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
