import React, { useState } from 'react';
import { Calendar, ArrowRight, ShieldCheck, Star, Play, Pause, MapPin, Sparkles } from 'lucide-react';
import { CLINIC_DISPLAY_PHONE } from '../utils/appointment';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0a09] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Video Loop Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isPlayingVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105 transition-transform duration-1000 ease-out"
            poster="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80"
          >
            {/* Cinematic subtle water ripple / dental aesthetic loop */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-water-reflections-in-a-swimming-pool-43224-large.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center opacity-20 filter brightness-75"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80')`,
            }}
          />
        )}

        {/* Ambient Dark/Warm Lighting & Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-[#0c0a09]/50" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c8a24d]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8a6825]/15 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Subtle geometric hairline pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Unboxed Metadata Kicker (Anti-slop Zero-Pill) */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-[#c8a24d] font-medium tracking-wider uppercase mb-6">
          <span className="flex items-center gap-1.5 text-[#f5f2ec]">
            <Star className="w-3.5 h-3.5 fill-[#c8a24d] text-[#c8a24d]" />
            <span className="font-semibold text-white">3.8 (76 Reviews)</span>
          </span>
          <span className="text-[#44403c]">·</span>
          <span>Medical Clinic in Indalabele, Karnataka</span>
          <span className="text-[#44403c]">·</span>
          <span className="text-[#a8a29e]">Sarjapura-Attibele Road</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#fdfaf3] leading-[1.12] mb-6 max-w-4xl">
          Masterful Dental Artistry & <br className="hidden sm:inline" />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#eddcb0] via-[#c8a24d] to-[#aa8233]">
            Bespoke Facial Aesthetics
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#a8a29e] max-w-2xl font-light leading-relaxed mb-10">
          Sri Krishna General & Dental Clinic blends over 25 years of clinical mastery in Attibele with digital smile design, permanent implantology, and modern pain-free aesthetic dentistry.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 rounded bg-gradient-to-r from-[#c8a24d] to-[#aa8233] hover:from-[#d8b76e] hover:to-[#b88f3e] text-[#090807] font-semibold text-base shadow-xl shadow-[#c8a24d]/15 hover:shadow-[#c8a24d]/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Book a Consultation</span>
          </button>

          <a
            href="#treatments"
            className="w-full sm:w-auto px-8 py-4 rounded border border-[#332b22] hover:border-[#c8a24d]/60 bg-[#141210]/60 hover:bg-[#1a1714] text-[#e7e5e4] hover:text-[#fdfaf3] text-base font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Treatments</span>
            <ArrowRight className="w-4 h-4 text-[#c8a24d]" />
          </a>
        </div>

        {/* Key Clinic Stats (Clean typographic layout, zero-pill) */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#241f1a] text-left">
          <div className="flex flex-col">
            <span className="font-serif text-3xl md:text-4xl text-[#fdfaf3] font-light">25+</span>
            <span className="text-xs text-[#a8a29e] tracking-wide mt-1">Years Clinical Mastery</span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-3xl md:text-4xl text-[#fdfaf3] font-light">12,000+</span>
            <span className="text-xs text-[#a8a29e] tracking-wide mt-1">Patient Smiles Transformed</span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-3xl md:text-4xl text-[#fdfaf3] font-light">100%</span>
            <span className="text-xs text-[#a8a29e] tracking-wide mt-1">Hospital-Grade Sterilization</span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-3xl md:text-4xl text-[#c8a24d] font-light">10 AM – 9 PM</span>
            <span className="text-xs text-[#a8a29e] tracking-wide mt-1">Flexible Morning & Evening</span>
          </div>
        </div>
      </div>

      {/* Ambient Video Control Toggle (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-2">
        <button
          onClick={() => setIsPlayingVideo(!isPlayingVideo)}
          className="p-2.5 rounded-full bg-[#141210]/80 border border-[#2a251e] text-[#a8a29e] hover:text-[#fdfaf3] hover:border-[#c8a24d] transition-colors"
          aria-label={isPlayingVideo ? 'Pause ambient video loop' : 'Play ambient video loop'}
          title={isPlayingVideo ? 'Pause ambient background' : 'Play ambient background'}
        >
          {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
};
