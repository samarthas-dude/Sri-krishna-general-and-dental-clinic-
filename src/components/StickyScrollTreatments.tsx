import React, { useState } from 'react';
import { SIGNATURE_TREATMENTS } from '../data/clinicData';
import { ClinicService } from '../types';
import { Sparkles, Clock, Check, Shield, ArrowUpRight, ChevronRight } from 'lucide-react';

interface StickyScrollTreatmentsProps {
  onSelectTreatment: (serviceId: string) => void;
}

export const StickyScrollTreatments: React.FC<StickyScrollTreatmentsProps> = ({ onSelectTreatment }) => {
  const [activeTreatment, setActiveTreatment] = useState<ClinicService>(SIGNATURE_TREATMENTS[0]);

  return (
    <section id="treatments" className="py-24 bg-[#0a0807] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#c8a24d]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Signature Aesthetic Protocols</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight leading-tight">
            Curated Treatments Crafted for <br className="hidden sm:inline" />
            <span className="italic text-[#d6ad55]">Harmonious Perfection</span>
          </h2>
          <p className="text-[#a8a29e] text-base mt-4 font-light leading-relaxed">
            Each protocol at Sri Krishna Clinic is tailored through high-resolution digital scans and precision clinical craftsmanship. Select any treatment to inspect procedure specifics and clinical timelines.
          </p>
        </div>

        {/* Sticky Scroll Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Treatment Selector & Narratives (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {SIGNATURE_TREATMENTS.map((treatment, idx) => {
              const isActive = activeTreatment.id === treatment.id;
              const formattedIndex = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={treatment.id}
                  onClick={() => setActiveTreatment(treatment)}
                  className={`p-6 sm:p-8 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#141210] border-[#c8a24d]/50 shadow-xl shadow-[#0c0a09]'
                      : 'bg-[#0f0d0b]/60 border-[#241f1a] hover:border-[#383127] hover:bg-[#120f0d]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-serif text-sm tracking-widest ${isActive ? 'text-[#c8a24d]' : 'text-[#78716c]'}`}>
                        {formattedIndex}.
                      </span>
                      <h3 className={`font-serif text-xl sm:text-2xl font-normal ${isActive ? 'text-[#fdfaf3]' : 'text-[#d6d3d1]'}`}>
                        {treatment.title}
                      </h3>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? 'text-[#c8a24d] rotate-90' : 'text-[#78716c]'
                      }`}
                    />
                  </div>

                  <p className="text-xs text-[#c8a24d] font-medium tracking-wider uppercase mt-1 pl-7">
                    {treatment.subtitle}
                  </p>

                  <p className="text-sm text-[#a8a29e] mt-4 pl-7 leading-relaxed font-light">
                    {treatment.description}
                  </p>

                  {/* Expanded Treatment Highlights when active */}
                  {isActive && (
                    <div className="mt-6 pl-7 pt-6 border-t border-[#241f1a] flex flex-col gap-4 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#78716c] block">Clinical Duration:</span>
                          <span className="text-[#f5f2ec] font-medium mt-0.5 block">{treatment.duration}</span>
                        </div>
                        <div>
                          <span className="text-[#78716c] block">Estimated Recovery:</span>
                          <span className="text-[#f5f2ec] font-medium mt-0.5 block">{treatment.recoveryTime}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        <span className="text-xs text-[#78716c] uppercase tracking-wider block font-medium">
                          Clinical Key Highlights:
                        </span>
                        {treatment.benefits.slice(0, 3).map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-[#d6d3d1]">
                            <Check className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-[#78716c] block">Pricing Guideline</span>
                          <span className="text-sm font-semibold text-[#fdfaf3]">{treatment.startingPrice}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTreatment(treatment.id);
                          }}
                          className="px-5 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5 shadow-md shadow-[#c8a24d]/10 cursor-pointer"
                        >
                          <span>Book Consultation</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Macro Visual Container (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative rounded-xl overflow-hidden border border-[#2a251e] bg-[#141210] shadow-2xl p-3">
              {/* Hairline Frame Accent */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#090807]">
                <img
                  key={activeTreatment.id}
                  src={activeTreatment.macroImage}
                  alt={activeTreatment.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out transform scale-100 hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-transparent to-black/30" />

                {/* Macro Badge Details on Visual Container */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-[#0f0d0b]/90 backdrop-blur-md border border-[#26221d] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-widest text-[#c8a24d] font-semibold">
                      Macro Specimen View
                    </span>
                    <span className="text-[11px] text-[#a8a29e] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#c8a24d]" />
                      {activeTreatment.duration}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg text-[#fdfaf3] leading-snug">
                    {activeTreatment.title}
                  </h4>

                  <p className="text-xs text-[#a8a29e] line-clamp-2 font-light">
                    {activeTreatment.recommendedFor}
                  </p>

                  <div className="pt-2 border-t border-[#241f1a] flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-[#c8a24d]">
                      {activeTreatment.startingPrice}
                    </span>
                    <button
                      onClick={() => onSelectTreatment(activeTreatment.id)}
                      className="text-xs font-medium text-[#fdfaf3] hover:text-[#c8a24d] flex items-center gap-1 transition-colors underline-offset-4 hover:underline cursor-pointer"
                    >
                      <span>Select & Book Slot</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
