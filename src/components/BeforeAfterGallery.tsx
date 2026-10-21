import React, { useState, useRef } from 'react';
import { BEFORE_AFTER_CASES } from '../data/clinicData';
import { BeforeAfterCase } from '../types';
import { Sparkles, ArrowRight, Eye, Check } from 'lucide-react';

interface BeforeAfterGalleryProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ onOpenBooking }) => {
  const [selectedCase, setSelectedCase] = useState<BeforeAfterCase>(BEFORE_AFTER_CASES[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#0c0a09] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Documented Clinical Outcomes</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight">
              Before & After <br className="hidden sm:inline" />
              <span className="italic text-[#d6ad55]">Transformative Results</span>
            </h2>
            <p className="text-[#a8a29e] text-sm sm:text-base mt-4 font-light leading-relaxed">
              Drag the interactive central divider to compare preoperative dental conditions with our completed aesthetic restorations. All cases photographed under standardized clinical lighting.
            </p>
          </div>

          {/* Quick Case Switcher Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {BEFORE_AFTER_CASES.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCase(item);
                  setSliderPosition(50);
                }}
                className={`text-xs px-3.5 py-2 rounded transition-all cursor-pointer ${
                  selectedCase.id === item.id
                    ? 'bg-[#c8a24d] text-[#0a0807] font-semibold shadow-md shadow-[#c8a24d]/20'
                    : 'bg-[#141210] border border-[#2a241d] text-[#a8a29e] hover:text-[#fdfaf3] hover:border-[#3d3428]'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Dual-Image Comparison Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Draggable Comparison Viewport (8 cols) */}
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              onClick={(e) => handleSliderMove(e.clientX)}
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden select-none border border-[#2a241d] shadow-2xl cursor-ew-resize bg-[#090807]"
            >
              {/* "After" Image (Full background) */}
              <img
                src={selectedCase.afterImage}
                alt={`${selectedCase.title} - Post-treatment`}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded bg-[#0c0a09]/80 backdrop-blur-md border border-[#2a241d] text-[11px] font-semibold text-[#c8a24d] tracking-wider uppercase">
                After Transformation
              </div>

              {/* "Before" Image (Clipped by slider position) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={selectedCase.beforeImage}
                  alt={`${selectedCase.title} - Pre-treatment`}
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  }}
                  draggable={false}
                />
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded bg-[#0c0a09]/80 backdrop-blur-md border border-[#2a241d] text-[11px] font-semibold text-[#a8a29e] tracking-wider uppercase">
                  Before Treatment
                </div>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                className="absolute top-0 bottom-0 z-30 w-0.5 bg-[#f5f2ec] pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#141210] border-2 border-[#c8a24d] shadow-xl flex items-center justify-center text-[#c8a24d]">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] font-bold">◀</span>
                    <span className="text-[10px] font-bold">▶</span>
                  </div>
                </div>
              </div>

              {/* Touch hint overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#0c0a09]/75 backdrop-blur-sm border border-[#241f1a] text-[10px] text-[#a8a29e] pointer-events-none">
                Drag slider to inspect details
              </div>
            </div>
          </div>

          {/* Active Case Narrative Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col p-6 rounded-xl bg-[#141210] border border-[#241f1a]">
            <span className="text-xs uppercase tracking-widest text-[#c8a24d] font-semibold">
              {selectedCase.category}
            </span>

            <h3 className="font-serif text-2xl text-[#fdfaf3] font-normal mt-1">
              {selectedCase.title}
            </h3>

            <p className="text-xs text-[#a8a29e] mt-1">
              Protocol: <span className="text-[#d6d3d1] font-medium">{selectedCase.treatmentName}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 my-5 py-4 border-y border-[#241f1a] text-xs">
              <div>
                <span className="text-[#78716c] block">Duration:</span>
                <span className="text-[#f5f2ec] font-medium mt-0.5 block">{selectedCase.duration}</span>
              </div>
              <div>
                <span className="text-[#78716c] block">Patient Age:</span>
                <span className="text-[#f5f2ec] font-medium mt-0.5 block">{selectedCase.patientAge}</span>
              </div>
            </div>

            <p className="text-xs text-[#a8a29e] leading-relaxed font-light mb-6">
              {selectedCase.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {selectedCase.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#1c1814] text-[#d6d3d1] border border-[#2e261d]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onOpenBooking()}
              className="w-full py-3 px-4 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer mt-auto"
            >
              <span>Consult on Similar Case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid of Results / Cases with Elegant Hover Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BEFORE_AFTER_CASES.map((item) => {
            const isCurrent = selectedCase.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCase(item);
                  setSliderPosition(50);
                }}
                className={`group rounded-lg overflow-hidden border p-3 transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#141210] border-[#c8a24d]/60 shadow-lg shadow-[#c8a24d]/10'
                    : 'bg-[#0f0d0b] border-[#241f1a] hover:border-[#3d3428] hover:bg-[#120f0d]'
                }`}
              >
                <div className="relative aspect-[4/3] rounded overflow-hidden bg-black mb-3">
                  <img
                    src={item.afterImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[#c8a24d] font-medium border border-white/10">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-serif text-base text-[#fdfaf3] font-normal group-hover:text-[#c8a24d] transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs text-[#78716c] mt-1 line-clamp-1">
                  {item.treatmentName}
                </p>

                <div className="mt-3 pt-2.5 border-t border-[#1f1a14] flex items-center justify-between text-xs text-[#a8a29e]">
                  <span>{item.duration}</span>
                  <span className="text-[#c8a24d] group-hover:translate-x-0.5 transition-transform">
                    Compare ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
