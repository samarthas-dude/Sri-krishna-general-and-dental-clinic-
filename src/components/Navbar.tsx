import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, MapPin, Menu, X, Sparkles, UserCheck } from 'lucide-react';
import { CLINIC_DISPLAY_PHONE, CLINIC_PHONE, isClinicOpenNow } from '../utils/appointment';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenPortal: () => void;
  onOpenStaff: () => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenPortal,
  onOpenStaff,
  bookingCount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinicStatus, setClinicStatus] = useState(isClinicOpenNow());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Update clinic status every minute
    const interval = setInterval(() => {
      setClinicStatus(isClinicOpenNow());
    }, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Treatments', href: '#treatments' },
    { name: 'Doctor Profile', href: '#doctor' },
    { name: 'Before & After', href: '#gallery' },
    { name: 'Clinical Services', href: '#services' },
    { name: 'Hours & Location', href: '#location' },
    { name: 'Patient Reviews', href: '#reviews' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Clinic Status & Hotline Bar */}
      <div className="bg-[#090807] border-b border-[#241f1a] text-xs text-[#a8a29e] px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  clinicStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
                }`}
                aria-hidden="true"
              />
              <span className={clinicStatus.isOpen ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                {clinicStatus.statusText}
              </span>
            </span>
            <span className="hidden sm:inline text-[#44403c]">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-[#d6d3d1]">
              <MapPin className="w-3.5 h-3.5 text-[#c8a24d]" />
              Jayanna Complex, Jigala Road, Attibele, Bengaluru
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <a
              href={`tel:${CLINIC_PHONE}`}
              className="flex items-center gap-1.5 text-[#e7e5e4] hover:text-[#c8a24d] transition-colors font-medium tracking-wide"
              aria-label={`Call clinic at ${CLINIC_DISPLAY_PHONE}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#c8a24d]" />
              <span className="hidden md:inline">{CLINIC_DISPLAY_PHONE}</span>
            </a>

            <button
              onClick={onOpenPortal}
              className="text-[#a8a29e] hover:text-[#fdfaf3] transition-colors flex items-center gap-1 text-xs underline-offset-4 hover:underline"
              aria-label="View existing appointments"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#c8a24d]" />
              <span className="hidden md:inline">My Bookings</span>
              {bookingCount > 0 && (
                <span className="bg-[#c8a24d]/20 text-[#f6efd7] border border-[#c8a24d]/40 rounded-full px-1.5 text-[10px] font-semibold">
                  {bookingCount}
                </span>
              )}
            </button>

            <span className="text-[#332b21]">|</span>

            {/* Staff Desk / Who Booked Portal Switch */}
            <button
              onClick={onOpenStaff}
              className="px-2 py-0.5 rounded bg-[#171411] border border-[#332a20] hover:border-[#c8a24d] text-[11px] text-[#c8a24d] hover:text-[#fdfaf3] transition-colors flex items-center gap-1 font-medium cursor-pointer"
              title="Staff View: See who booked, schedules, and daily patients"
            >
              <Sparkles className="w-3 h-3 text-[#c8a24d]" />
              <span>Staff Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className={`px-4 lg:px-8 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0f0d0b]/95 backdrop-blur-md py-3 shadow-xl border-b border-[#241f1a]'
            : 'bg-[#0c0a09]/80 backdrop-blur-sm py-5 border-b border-white/5'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded border border-[#c8a24d]/60 bg-gradient-to-br from-[#1c1814] to-[#0c0a09] flex items-center justify-center shadow-inner group-hover:border-[#c8a24d] transition-colors">
              <span className="font-serif text-[#c8a24d] text-lg font-bold tracking-wider">SK</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-widest text-[#f5f2ec] font-semibold uppercase leading-tight group-hover:text-[#c8a24d] transition-colors">
                Sri Krishna
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#a8a29e] uppercase font-light">
                General & Dental Clinic
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-[#d6d3d1]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#c8a24d] transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#c8a24d] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Consultation CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenBooking()}
              className="bg-gradient-to-r from-[#c8a24d] to-[#aa8233] hover:from-[#d8b76e] hover:to-[#b88f3e] text-[#0a0807] font-semibold text-xs md:text-sm px-5 py-2.5 rounded shadow-lg shadow-[#c8a24d]/10 hover:shadow-[#c8a24d]/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#d6d3d1] hover:text-[#fdfaf3] border border-[#2a251e] rounded bg-[#141210]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-4 pb-6 px-4 bg-[#141210] border border-[#2a251e] rounded-lg shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#241f1a] text-xs text-[#a8a29e]">
              <Clock className="w-3.5 h-3.5 text-[#c8a24d]" />
              <span>{clinicStatus.nextOpenTime}</span>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-[#e7e5e4] hover:text-[#c8a24d] py-1 border-b border-[#1c1814]"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="w-full text-center py-2.5 px-4 rounded border border-[#332b22] text-[#d6d3d1] text-sm hover:bg-[#1a1714]"
              >
                Find My Existing Appointment
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full text-center py-3 px-4 rounded bg-[#c8a24d] text-[#0a0807] font-semibold text-sm hover:bg-[#d8b76e]"
              >
                Book a Consultation
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
