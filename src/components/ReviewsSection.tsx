import React, { useState } from 'react';
import { PATIENT_REVIEWS } from '../data/clinicData';
import { Star, ShieldCheck, MessageCircle, ExternalLink, ThumbsUp } from 'lucide-react';
import { PatientReview } from '../types';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<PatientReview[]>(PATIENT_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [treatmentName, setTreatmentName] = useState('Cosmetic Consultation');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const newReview: PatientReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      rating: reviewRating,
      date: 'Just now',
      treatment: treatmentName,
      text: reviewText.trim(),
      verified: true,
    };

    setReviewsList([newReview, ...reviewsList]);
    setReviewSuccess(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccess(false);
      setAuthorName('');
      setReviewText('');
    }, 2000);
  };

  return (
    <section id="reviews" className="py-24 bg-[#0f0d0b] text-[#e7e5e4] relative overflow-hidden border-t border-[#1f1a14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c8a24d] mb-3">
              <Star className="w-4 h-4 fill-[#c8a24d]" />
              <span>Verified Patient Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#fdfaf3] tracking-tight">
              Honest Feedback from <br className="hidden sm:inline" />
              <span className="italic text-[#d6ad55]">Our Local Community</span>
            </h2>
            <p className="text-[#a8a29e] text-sm sm:text-base mt-4 font-light leading-relaxed">
              Serving Indalabele, Attibele, Sarjapura, and Anekal Taluk with consistent transparency, pain-free clinical care, and compassionate attention.
            </p>
          </div>

          {/* Rating Summary Card (3.8 rating, 76 reviews) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#141210] border border-[#2a241d] shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-[#241f1a]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a8a29e] font-semibold block">
                  Google Clinic Rating
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-5xl font-bold text-[#fdfaf3]">3.8</span>
                  <span className="text-xs text-[#78716c]">/ 5.0</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? 'fill-[#c8a24d] text-[#c8a24d]' : 'text-[#443c30]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#a8a29e] block mt-1">
                  Based on <strong>76 Patient Reviews</strong>
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs">
              <span className="text-[#78716c]">Medical Clinic in Indalabele, Karnataka</span>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-[#c8a24d] hover:text-[#d8b76e] font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                {showReviewForm ? 'Cancel Review' : '+ Share Your Feedback'}
              </button>
            </div>
          </div>
        </div>

        {/* Optional Add Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-12 p-6 rounded-xl bg-[#141210] border border-[#c8a24d]/40 shadow-2xl max-w-2xl mx-auto space-y-4"
          >
            <h4 className="font-serif text-xl text-[#fdfaf3] font-normal">
              Share Your Experience at Sri Krishna Clinic
            </h4>

            {reviewSuccess ? (
              <p className="text-emerald-400 text-xs py-4 text-center font-medium">
                ✓ Thank you for your review! It has been posted to our verified patient wall.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[#a8a29e] block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Manjunath"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[#a8a29e] block mb-1">Treatment Received</label>
                    <input
                      type="text"
                      placeholder="e.g. Dental Crown / Whitening"
                      value={treatmentName}
                      onChange={(e) => setTreatmentName(e.target.value)}
                      className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-[#a8a29e] block mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating
                              ? 'fill-[#c8a24d] text-[#c8a24d]'
                              : 'text-[#443c30]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[#a8a29e] ml-2">{reviewRating} Stars</span>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-[#a8a29e] block mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe Dr. Krishna's care, the clinic hygiene, or consultation guidance..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-[#0a0807] border border-[#2a241d] rounded px-3 py-2 text-[#fdfaf3] focus:border-[#c8a24d] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-[#c8a24d] hover:bg-[#d8b76e] text-[#0a0807] font-semibold text-xs tracking-wide transition-colors cursor-pointer"
                >
                  Post Review
                </button>
              </>
            )}
          </form>
        )}

        {/* Patient Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-xl bg-[#141210] border border-[#241f1a] flex flex-col justify-between hover:border-[#3d3326] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-[#c8a24d] text-[#c8a24d]' : 'text-[#443c30]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#78716c]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#a8a29e] leading-relaxed font-light italic mb-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#1f1a14] flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-medium text-[#fdfaf3] text-xs">{rev.author}</h5>
                  <span className="text-[10px] text-[#78716c] block">{rev.treatment}</span>
                </div>
                {rev.verified && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
