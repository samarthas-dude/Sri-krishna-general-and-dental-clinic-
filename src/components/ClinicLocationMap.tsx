import React, { useState } from 'react';
import { CLINIC_WEEKLY_TIMINGS, CLINIC_DISPLAY_PHONE, CLINIC_PHONE, CLINIC_ADDRESS, isClinicOpenNow } from '../utils/appointment';
import { MapPin, Navigation, Phone, Clock, Share2, Check, ExternalLink, Car, AlertTriangle } from 'lucide-react';

export const ClinicLocationMap: React.FC = () => {
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const clinicStatus = isClinicOpenNow();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Sri Krishna General and Dental Clinic Jayanna Complex Jigala Road Attibele Bengaluru')}`;

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sri Krishna General and Dental Clinic',
        text: `${CLINIC_ADDRESS}\nPhone: ${CLINIC_DISPLAY_PHONE}`,
        url: googleMapsDirectionsUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${CLINIC_ADDRESS} | Phone: ${CLINIC_DISPLAY_PHONE}`);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  return (
    <section id="location" className="py-24 bg-[#0a0807] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
            <MapPin className="w-4 h-4" />
            <span>Clinic Location & Operating Hours</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight">
            Visiting Our Clinic in <br className="hidden sm:inline" />
            <span className="italic text-[#d6ad55]">Attibele, Bengaluru</span>
          </h2>
          <p className="text-[#a8a29e] text-sm sm:text-base mt-4 font-light leading-relaxed">
            Conveniently situated in Jayanna Complex at Jigala Cross on Sarjapura-Attibele Road, with dedicated patient parking and wheelchair-friendly access.
          </p>
        </div>

        {/* Location & Schedule Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Address, Navigation & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address & Quick Actions Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#141210] border border-[#2a241d] shadow-xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#c8a24d] font-semibold block">
                    Official Registered Address
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#fdfaf3] font-normal mt-1 leading-snug">
                    Jayanna Complex, Jigala Road
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a8a29e] mt-2 font-light leading-relaxed">
                    St. Dominics School Road, Jigala Cross, Jigala Road, Opp. Mayura Bakery, Sarjapura Road, Attibele, Anekal Taluk, Bengaluru, Karnataka 562107
                  </p>
                </div>

                <span className="text-xs font-mono text-[#c8a24d] p-2 rounded bg-[#0c0a09] border border-[#2a241d] shrink-0 hidden sm:block">
                  PIN: 562107
                </span>
              </div>

              {/* Transit & Distance Indicators from Prompt */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#0c0a09] border border-[#241f1a] text-center text-xs">
                <div>
                  <span className="text-[#78716c] block">Distance</span>
                  <span className="text-[#fdfaf3] font-medium mt-0.5 block">1.1 km</span>
                </div>
                <div>
                  <span className="text-[#78716c] block">By Car / Auto</span>
                  <span className="text-[#c8a24d] font-medium mt-0.5 block">~5 mins</span>
                </div>
                <div>
                  <span className="text-[#78716c] block">Walking</span>
                  <span className="text-[#fdfaf3] font-medium mt-0.5 block">~20 mins</span>
                </div>
              </div>

              {/* Action Buttons: Directions, Call, Share */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${CLINIC_PHONE}`}
                  className="px-4 py-3 rounded border border-[#332b22] hover:border-[#c8a24d] text-[#e7e5e4] hover:text-[#fdfaf3] font-medium text-xs transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#c8a24d]" />
                  <span>Call {CLINIC_DISPLAY_PHONE}</span>
                </a>

                <button
                  onClick={handleShareLocation}
                  className="px-4 py-3 rounded border border-[#332b22] hover:border-[#c8a24d] text-[#a8a29e] hover:text-[#fdfaf3] text-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedAddress ? 'Address Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Embedded Google Map Frame */}
            <div className="rounded-xl overflow-hidden border border-[#2a241d] bg-[#141210] shadow-xl relative aspect-[16/9]">
              <iframe
                title="Sri Krishna General and Dental Clinic Location"
                src="https://maps.google.com/maps?q=Attibele%20Bengaluru%20Sarjapura%20Road%20Jigala%20Cross&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 left-3 bg-[#0c0a09]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#262018] text-[11px] text-[#d6d3d1] flex items-center gap-1.5 pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-[#c8a24d]" />
                <span>Indalabele · Attibele · Bengaluru 562107</span>
              </div>
            </div>
          </div>

          {/* Right Column: Weekly Clinic Hours Schedule (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl bg-[#141210] border border-[#2a241d] shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#241f1a]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#c8a24d] font-semibold block">
                  Operating Timetable
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#fdfaf3] font-normal mt-1">
                  Weekly Schedule
                </h3>
              </div>

              {/* Live Status indicator */}
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded border ${
                  clinicStatus.isOpen
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
                    : 'bg-amber-950/40 border-amber-800/40 text-amber-400'
                }`}
              >
                {clinicStatus.isOpen ? 'Open Now' : 'Closed Now'}
              </span>
            </div>

            {/* Timings Table */}
            <div className="space-y-2 text-xs">
              {CLINIC_WEEKLY_TIMINGS.map((timing) => {
                const isToday = timing.dayIndex === currentDayIndex;

                return (
                  <div
                    key={timing.day}
                    className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                      isToday
                        ? 'bg-[#1f1a14] border border-[#c8a24d]/60 font-medium text-[#fdfaf3]'
                        : 'bg-[#0f0d0b] text-[#a8a29e]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#c8a24d]' : 'bg-[#332b22]'}`} />
                      <span className={isToday ? 'text-[#c8a24d] font-semibold' : 'text-[#d6d3d1]'}>
                        {timing.day}
                        {isToday && <span className="ml-1 text-[10px] text-[#c8a24d]">(Today)</span>}
                      </span>
                    </div>

                    <div className="text-right">
                      {timing.isClosed ? (
                        <span className="text-rose-400 font-medium">Closed</span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="block text-[11px] text-[#f5f2ec]">{timing.morning}</span>
                          <span className="block text-[11px] text-[#c8a24d]">{timing.evening}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Special note regarding Monday/Holidays */}
            <div className="p-3 rounded-lg bg-[#0c0a09] border border-[#241f1a] text-[11px] text-[#a8a29e] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#c8a24d] shrink-0 mt-0.5" />
              <span>
                <strong>Note on Special Days:</strong> On festival holidays (such as Pargat Diwas), hours might slightly differ. Please phone <strong>{CLINIC_DISPLAY_PHONE}</strong> prior to arrival.
              </span>
            </div>

            {/* Direct Phone Assistance */}
            <div className="pt-2 border-t border-[#241f1a] flex items-center justify-between text-xs">
              <span className="text-[#78716c]">Immediate Emergency Assistance:</span>
              <a
                href={`tel:${CLINIC_PHONE}`}
                className="font-mono text-[#c8a24d] font-semibold hover:underline"
              >
                {CLINIC_DISPLAY_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
