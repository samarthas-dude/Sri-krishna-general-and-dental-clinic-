import React from 'react';
import { DOCTOR_DATA } from '../data/clinicData';
import { Award, CheckCircle, Shield, Calendar, Phone, HeartPulse, Sparkles } from 'lucide-react';
import { CLINIC_DISPLAY_PHONE, CLINIC_PHONE } from '../utils/appointment';

interface DoctorProfileProps {
  onOpenBooking: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({ onOpenBooking }) => {
  return (
    <section id="doctor" className="py-24 bg-[#0f0d0b] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#c8a24d]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Doctor Portrait Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              {/* Outer Luxury Frame */}
              <div className="relative p-3 rounded-2xl bg-[#141210] border border-[#2e271f] shadow-2xl">
                {/* Gold hairline accent ring */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#1a1714]">
                  <img
                    src={DOCTOR_DATA.image}
                    alt={DOCTOR_DATA.name}
                    className="w-full h-full object-cover object-top filter contrast-[1.03] transition-all duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* Subtle lower gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Doctor badge at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-lg bg-[#0c0a09]/90 backdrop-blur-md border border-[#2a241c]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] tracking-widest text-[#c8a24d] uppercase font-semibold block">
                          Chief Clinical Director
                        </span>
                        <h4 className="font-serif text-lg text-[#fdfaf3] font-normal">
                          {DOCTOR_DATA.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-xl font-bold text-[#c8a24d]">
                          {DOCTOR_DATA.experienceYears}+
                        </span>
                        <span className="text-[10px] text-[#a8a29e] block">Yrs Practice</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Clinical Practice Badge */}
              <div className="absolute -top-3 -right-3 bg-[#1c1814] border border-[#c8a24d]/40 rounded-lg p-2.5 shadow-xl flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#c8a24d]" />
                <span className="text-xs font-medium text-[#f5f2ec]">Licensed Dentist (Regd.)</span>
              </div>
            </div>
          </div>

          {/* Doctor Narrative & Credentials Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Meet The Chief Surgeon</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight leading-tight">
              {DOCTOR_DATA.name}
            </h2>

            <p className="text-sm font-medium text-[#c8a24d] mt-1 tracking-wide">
              {DOCTOR_DATA.title} · <span className="text-[#a8a29e] font-light">{DOCTOR_DATA.qualifications}</span>
            </p>

            {/* Philosophy quote */}
            <div className="mt-6 p-4 rounded-lg bg-[#141210] border border-[#262019] text-[#d6d3d1] italic font-serif text-base sm:text-lg">
              &ldquo;True aesthetic dentistry is not about creating artificial uniformity; it is about restoring the innate vitality, natural light reflection, and functional balance of your smile.&rdquo;
            </div>

            <p className="text-sm text-[#a8a29e] font-light leading-relaxed mt-6">
              {DOCTOR_DATA.about}
            </p>

            {/* Specializations & Clinical Ethos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#241f1a]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c8a24d] font-semibold block mb-3">
                  Core Clinical Specializations
                </span>
                <ul className="space-y-2 text-xs text-[#d6d3d1]">
                  {DOCTOR_DATA.specializations.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#c8a24d] font-semibold block mb-3">
                  Patient Care Philosophy
                </span>
                <ul className="space-y-2 text-xs text-[#d6d3d1]">
                  {DOCTOR_DATA.philosophies.map((philo, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <HeartPulse className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                      <span>{philo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Consultation Details & Booking */}
            <div className="mt-10 p-5 rounded-lg bg-[#141210] border border-[#2a241d] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#78716c] block">Consultation Schedule</span>
                <span className="text-sm font-medium text-[#fdfaf3] block mt-0.5">
                  10:00 AM – 1:00 PM & 5:00 PM – 9:00 PM (Mon–Sat)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`tel:${CLINIC_PHONE}`}
                  className="px-4 py-2.5 rounded border border-[#332b22] hover:border-[#c8a24d] text-xs font-medium text-[#e7e5e4] hover:text-[#fdfaf3] transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c8a24d]" />
                  <span>Call {CLINIC_DISPLAY_PHONE}</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="px-5 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-[#c8a24d]/10 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
