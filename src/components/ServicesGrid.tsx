import React, { useState } from 'react';
import { CLINICAL_SERVICES } from '../data/clinicData';
import { ClinicService } from '../types';
import { Sparkles, Clock, Check, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ServicesGridProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ClinicService | null>(null);

  const categories = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'preventive', label: 'Routine & Preventive' },
    { id: 'restorative', label: 'Restorative Dentistry' },
    { id: 'replacement', label: 'Tooth Replacement' },
    { id: 'orthodontics', label: 'Orthodontics' },
    { id: 'oral-surgery', label: 'Oral Surgery & Gums' },
    { id: 'cosmetic', label: 'Cosmetic Dentistry' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? CLINICAL_SERVICES
    : CLINICAL_SERVICES.filter((s) => s.category === selectedCategory);

  return (
    <section id="services" className="py-24 bg-[#0a0807] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Full Clinical Spectrum</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight">
              Clinical Services & <br className="hidden sm:inline" />
              <span className="italic text-[#d6ad55]">Specialized Disciplines</span>
            </h2>
            <p className="text-[#a8a29e] text-sm sm:text-base mt-4 font-light leading-relaxed">
              From preventive ultrasonic scaling and rotary root canal therapies to guided implants, clear aligners, wisdom tooth surgery, and porcelain veneers in Attibele.
            </p>
          </div>

          {/* Interactive Category Tabs (Functional buttons as per frontend design constitution) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#141210] border border-[#241f1a] rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#c8a24d] text-[#0a0807] shadow-sm font-semibold'
                    : 'text-[#a8a29e] hover:text-[#fdfaf3] hover:bg-[#1c1814]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-xl overflow-hidden bg-[#0f0d0b] border border-[#241f1a] hover:border-[#c8a24d]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#0c0a09] flex flex-col justify-between"
            >
              <div>
                {/* Visual Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#0a0807]">
                  <img
                    src={service.macroImage}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0b] via-transparent to-black/20" />
                  
                  {/* Category subtle label */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0c0a09]/80 backdrop-blur-xs text-[10px] text-[#c8a24d] font-semibold uppercase tracking-wider border border-[#241f1a]">
                    {service.categoryLabel || service.category}
                  </div>

                  {service.startingPrice && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#0c0a09]/90 backdrop-blur-xs text-xs text-[#fdfaf3] font-medium border border-[#241f1a]">
                      {service.startingPrice}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[#78716c] mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c8a24d]" />
                    <span>{service.duration}</span>
                    <span>·</span>
                    <span>{service.recoveryTime}</span>
                  </div>

                  <h3 className="font-serif text-xl text-[#fdfaf3] font-normal group-hover:text-[#c8a24d] transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#a8a29e] mt-2 line-clamp-3 leading-relaxed font-light">
                    {service.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#1c1814] space-y-1.5">
                    {service.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#d6d3d1]">
                        <Check className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-transparent">
                <button
                  onClick={() => setActiveModalService(service)}
                  className="text-xs text-[#a8a29e] hover:text-[#fdfaf3] underline-offset-4 hover:underline transition-colors cursor-pointer"
                >
                  Clinical Details
                </button>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="px-4 py-2 rounded bg-[#1c1814] hover:bg-[#c8a24d] text-[#d6d3d1] hover:text-[#0a0807] font-medium text-xs transition-all flex items-center gap-1.5 border border-[#2a241d] hover:border-transparent cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Details Modal */}
      {activeModalService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalService(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#141210] border border-[#2a241d] rounded-xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#c8a24d] font-semibold">
                  {activeModalService.categoryLabel || activeModalService.category} · Protocol Guide
                </span>
                <h3 className="font-serif text-2xl text-[#fdfaf3] mt-1 font-normal">
                  {activeModalService.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1 rounded text-[#78716c] hover:text-[#fdfaf3] border border-[#2a241d]"
                aria-label="Close protocol modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#a8a29e] font-light leading-relaxed mb-6">
              {activeModalService.description}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 rounded bg-[#0c0a09] border border-[#241f1a] text-xs mb-6">
              <div>
                <span className="text-[#78716c] block">Typical Duration</span>
                <span className="text-[#fdfaf3] font-medium mt-0.5 block">{activeModalService.duration}</span>
              </div>
              <div>
                <span className="text-[#78716c] block">Recovery Experience</span>
                <span className="text-[#fdfaf3] font-medium mt-0.5 block">{activeModalService.recoveryTime}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-[#1c1814]">
                <span className="text-[#78716c] block">Recommended For:</span>
                <span className="text-[#c8a24d] font-medium mt-0.5 block">{activeModalService.recommendedFor}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider text-[#d6d3d1] font-semibold mb-3">
                Key Clinical Benefits:
              </h4>
              <ul className="space-y-2">
                {activeModalService.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#a8a29e]">
                    <Check className="w-3.5 h-3.5 text-[#c8a24d] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#241f1a] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#78716c] block">Pricing Guideline</span>
                <span className="text-base font-semibold text-[#fdfaf3]">{activeModalService.startingPrice}</span>
              </div>

              <button
                onClick={() => {
                  const serviceId = activeModalService.id;
                  setActiveModalService(null);
                  onSelectService(serviceId);
                }}
                className="px-6 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs transition-colors cursor-pointer"
              >
                Book This Treatment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
