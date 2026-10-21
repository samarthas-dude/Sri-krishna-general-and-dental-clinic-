import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StickyScrollTreatments } from './components/StickyScrollTreatments';
import { DoctorProfile } from './components/DoctorProfile';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { ServicesGrid } from './components/ServicesGrid';
import { ClinicLocationMap } from './components/ClinicLocationMap';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PatientPortalModal } from './components/PatientPortalModal';
import { StaffDashboard } from './components/StaffDashboard';
import { Appointment } from './types';
import { INITIAL_SAMPLE_APPOINTMENTS } from './data/clinicData';
import { CLINIC_DISPLAY_PHONE, CLINIC_PHONE } from './utils/appointment';
import { Calendar, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'staff'>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('staff=1')) {
      return 'staff';
    }
    return 'public';
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('sri_krishna_clinic_appointments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SAMPLE_APPOINTMENTS;
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sri_krishna_clinic_appointments', JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  const handleOpenBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setPreselectedServiceId(undefined);
  };

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a))
    );
  };

  const handleUpdateAppointmentStatus = (
    id: string,
    newStatus: Appointment['status'] | 'checked-in' | 'completed'
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus as Appointment['status'] } : a))
    );
  };

  const handleDeleteBooking = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  if (currentView === 'staff') {
    return (
      <div className="min-h-screen bg-[#080706] text-[#e7e5e4] font-sans selection:bg-[#c8a24d]/30 selection:text-[#fdfaf3]">
        <StaffDashboard
          appointments={appointments}
          onBackToClinic={() => setCurrentView('public')}
          onUpdateStatus={handleUpdateAppointmentStatus}
          onAddNewBooking={handleAppointmentCreated}
          onDeleteBooking={handleDeleteBooking}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] flex flex-col font-sans selection:bg-[#c8a24d]/30 selection:text-[#fdfaf3]">
      {/* Sticky Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenStaff={() => setCurrentView('staff')}
        bookingCount={appointments.filter((a) => a.status === 'confirmed').length}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Full-screen Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* 2. Interactive Sticky-Scroll Section */}
        <StickyScrollTreatments onSelectTreatment={(id) => handleOpenBooking(id)} />

        {/* 3. Doctor Pic & Chief Surgeon Credentials Profile */}
        <DoctorProfile onOpenBooking={() => handleOpenBooking()} />

        {/* 4. Before & After Results Gallery with Interactive Draggable Comparison */}
        <BeforeAfterGallery onOpenBooking={(id) => handleOpenBooking(id)} />

        {/* 5. Clinical Services Grid with Category Tabs & Details */}
        <ServicesGrid onSelectService={(id) => handleOpenBooking(id)} />

        {/* 6. Clinic Location, Directions, Map & Operating Hours Timetable */}
        <ClinicLocationMap />

        {/* 7. Patient Reviews (3.8 Rating, 76 Reviews) */}
        <ReviewsSection />
      </main>

      {/* 8. Responsive Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenStaff={() => setCurrentView('staff')}
      />

      {/* Multi-step Patient Scheduling Interface Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        preselectedServiceId={preselectedServiceId}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Patient Portal & Appointments Management Modal */}
      <PatientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
      />

      {/* Floating Action Button for Quick Mobile / Desktop Access */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        <a
          href={`https://wa.me/91${CLINIC_PHONE}?text=${encodeURIComponent('Hello Sri Krishna Clinic, I would like to inquire about consultation availability.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto p-3.5 rounded-full bg-[#1b5e20] text-emerald-200 hover:text-white hover:bg-[#2e7d32] shadow-2xl transition-all transform hover:scale-105 border border-emerald-500/30 flex items-center gap-2"
          aria-label="Direct WhatsApp Message to Clinic"
          title={`WhatsApp ${CLINIC_DISPLAY_PHONE}`}
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline text-xs font-semibold pr-1">WhatsApp Chat</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="pointer-events-auto px-5 py-3.5 rounded-full bg-gradient-to-r from-[#c8a24d] to-[#aa8233] hover:from-[#d8b76e] hover:to-[#b88f3e] text-[#0a0807] font-semibold text-xs tracking-wide shadow-2xl shadow-[#c8a24d]/25 transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer border border-[#e8d098]/30"
          aria-label="Quick Book Consultation"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation</span>
        </button>
      </div>
    </div>
  );
}
