'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import { reviewAPI } from '@/lib/api';
import { UserAvatar } from '@/components/UserAvatar';

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  event: {
    id: number;
    title: string;
  };
  createdAt: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewAPI.getApprovedReviews();
        // Get all approved reviews, featured ones will be shown first
        const allReviews = response.data.reviews || [];
        setReviews(allReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Default testimonials if no reviews yet
  const defaultTestimonials = [
    {
      name: 'Samia Malik',
      role: 'Software Engineering Student',
      content: 'ORIYET has completely transformed my learning journey. The hands-on workshops and expert-led seminars helped me land my first internship at a top tech company!',
      image: 'https://res.cloudinary.com/di21cbkyf/image/upload/v1765720228/2ecbfdad-d6bd-4b01-98ad-de76e332fec2_pxm9h3.jpg',
      rating: 5,
    },
    {
      name: 'Nusrat Jahan',
      role: 'Digital Marketing Professional',
      content: 'The quality of events and certificates from ORIYET have significantly boosted my career. I learned practical skills that I use every day in my job.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      rating: 5,
    },
    {
      name: 'Shakib Hossain',
      role: 'Data Science Enthusiast',
      content: 'I love how easy it is to find and register for events. The platform is intuitive and the content is exceptional. Highly recommend to anyone looking to upskill!',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      rating: 5,
    },
  ];

  const displayTestimonials = reviews.length > 0 ? reviews : defaultTestimonials;

  if (isLoading) {
    return (
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-5 py-2 rounded-full bg-[#004aad]/10 text-[#004aad] text-sm font-semibold mb-4">
              Student Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              What Our Learners Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our learners who have transformed their careers through ORIYET
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-5 py-2 rounded-full bg-[#004aad]/10 text-[#004aad] text-sm font-semibold mb-4">
            Student Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            What Our Learners Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our learners who have transformed their careers through ORIYET
          </p>
        </div>

        {/* Infinite Scrolling Testimonials */}
        <Marquee speed={30} pauseOnHover gradient={false} direction="left" autoFill>
          {displayTestimonials.map((testimonial: any, index: number) => {
            const isRealReview = 'id' in testimonial;
            const name = isRealReview ? testimonial.user.name : testimonial.name;
            const avatar = isRealReview ? testimonial.user.avatar : testimonial.image;
            const role = isRealReview ? `Participant in ${testimonial.event.title}` : testimonial.role;
            const content = isRealReview ? testimonial.comment : testimonial.content;
            const rating = testimonial.rating;

            return (
              <div
                key={isRealReview ? testimonial.id : `default-${index}`}
                className="group mx-3 w-[80vw] sm:w-[350px] md:w-[380px] flex-shrink-0 bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-500"
              >
                {/* Subtle Background on Hover */}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    {isRealReview ? (
                      <UserAvatar name={name} avatar={avatar} size="lg" />
                    ) : (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-blue-300 transition-colors duration-300 flex-shrink-0">
                        <Image src={avatar} alt={name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 truncate">
                        {name}
                      </h3>
                      <p className="text-orange-600 text-xs font-semibold line-clamp-2">
                        {role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{rating}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 group-hover:text-gray-700 transition-colors duration-300">
                    {content}
                  </p>
                </div>
              </div>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}
