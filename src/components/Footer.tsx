import React, { useState } from 'react';
import { CLINIC_DISPLAY_PHONE, CLINIC_PHONE, CLINIC_ADDRESS, CLINIC_NAME } from '../utils/appointment';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Youtube, MessageSquare, Check, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenPortal: () => void;
  onOpenStaff: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenPortal, onOpenStaff }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) return;
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <footer className="bg-[#080706] text-[#e7e5e4] border-t border-[#1a1612] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-[#1c1814]">
          {/* Brand & Address Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded border border-[#c8a24d]/60 bg-[#141210] flex items-center justify-center">
                <span className="font-serif text-[#c8a24d] text-base font-bold">SK</span>
              </div>
              <div>
                <span className="font-serif text-base tracking-wider text-[#fdfaf3] font-semibold uppercase block">
                  Sri Krishna Clinic
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#a8a29e] uppercase font-light block">
                  General & Aesthetic Dentistry
                </span>
              </div>
            </div>

            <p className="text-xs text-[#a8a29e] font-light leading-relaxed">
              Serving the Indalabele, Attibele, Sarjapura, and Electronic City communities with world-class cosmetic dentistry, digital smile design, and physician-supervised facial aesthetic procedures.
            </p>

            <div className="space-y-2 text-xs text-[#a8a29e]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c8a24d] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {CLINIC_ADDRESS}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c8a24d] shrink-0" />
                <a href={`tel:${CLINIC_PHONE}`} className="hover:text-[#c8a24d] transition-colors font-mono">
                  {CLINIC_DISPLAY_PHONE}
                </a>
              </div>
            </div>

            {/* Social Media Integration */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#141210] border border-[#262018] flex items-center justify-center text-[#a8a29e] hover:text-[#c8a24d] hover:border-[#c8a24d] transition-colors"
                aria-label="Follow clinic on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#141210] border border-[#262018] flex items-center justify-center text-[#a8a29e] hover:text-[#c8a24d] hover:border-[#c8a24d] transition-colors"
                aria-label="Follow clinic on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#141210] border border-[#262018] flex items-center justify-center text-[#a8a29e] hover:text-[#c8a24d] hover:border-[#c8a24d] transition-colors"
                aria-label="Watch clinic patient education on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/91${CLINIC_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#141210] border border-[#262018] flex items-center justify-center text-[#a8a29e] hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                aria-label="Chat directly on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#fdfaf3] font-normal">
              Clinical Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#a8a29e]">
              <li>
                <a href="#treatments" className="hover:text-[#c8a24d] transition-colors">
                  Signature Aesthetic Protocols
                </a>
              </li>
              <li>
                <a href="#doctor" className="hover:text-[#c8a24d] transition-colors">
                  Dr. Srinivasa.K Profile
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#c8a24d] transition-colors">
                  Before & After Transformations
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#c8a24d] transition-colors">
                  All Clinical Services
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#c8a24d] transition-colors">
                  Timings & Jayanna Complex Map
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="hover:text-[#c8a24d] transition-colors text-left underline-offset-4 hover:underline cursor-pointer"
                >
                  Manage My Appointment / Reminders
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenStaff}
                  className="text-[#c8a24d] hover:text-[#fdfaf3] transition-colors text-left underline-offset-4 hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <span>Staff & Reception Desk</span>
                  <span className="text-[9px] bg-[#c8a24d]/20 text-[#c8a24d] px-1.5 py-0.5 rounded border border-[#c8a24d]/40">Staff</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Timings Snapshot (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#fdfaf3] font-normal">
              Operating Hours
            </h4>
            <div className="space-y-1.5 text-xs text-[#a8a29e]">
              <span className="block text-[#fdfaf3] font-medium">Mon – Fri:</span>
              <span className="block text-[11px] text-[#78716c]">10:00 AM – 1:00 PM</span>
              <span className="block text-[11px] text-[#78716c]">5:00 PM – 9:00 PM</span>
              <span className="block text-[#fdfaf3] font-medium pt-1">Saturday:</span>
              <span className="block text-[11px] text-[#78716c]">10:00 AM – 1:30 PM</span>
              <span className="block text-[11px] text-[#78716c]">5:00 PM – 9:00 PM</span>
              <span className="block text-rose-400 font-medium pt-1">Sunday: Closed</span>
            </div>
          </div>

          {/* Newsletter Signup Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-wider text-[#fdfaf3] font-normal">
              Aesthetic Journal & Updates
            </h4>
            <p className="text-xs text-[#a8a29e] font-light leading-relaxed">
              Subscribe for periodic guidance on dental hygiene, teeth whitening maintenance, and seasonal clinic announcements.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you. You have been subscribed to our patient journal.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#120f0d] border border-[#2a241d] focus:border-[#c8a24d] rounded-lg pl-9 pr-10 py-2.5 text-xs text-[#fdfaf3] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded bg-[#c8a24d] text-black hover:bg-[#d8b76e] transition-colors cursor-pointer"
                    aria-label="Submit newsletter subscription"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-[#78716c] block">
                  Zero spam. You can unsubscribe anytime.
                </span>
              </form>
            )}

            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 rounded bg-[#1c1814] hover:bg-[#c8a24d] text-[#c8a24d] hover:text-[#0a0807] border border-[#332a20] text-xs font-semibold transition-all cursor-pointer"
            >
              Book In-Person Consultation
            </button>
          </div>
        </div>

        {/* Legal & Medical Disclaimer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#78716c]">
          <p>© {new Date().getFullYear()} {CLINIC_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-[#a8a29e]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c8a24d]" />
              Hospital-Grade Autoclave Sterilization
            </span>
            <span>·</span>
            <span>Attibele, Anekal Taluk, Bengaluru 562107</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
