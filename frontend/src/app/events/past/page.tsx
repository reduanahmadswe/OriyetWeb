'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventAPI } from '@/lib/api';
import EventCard from '@/components/events/EventCard';
import { Pagination, EventCardSkeleton } from '@/components/ui';
import { ServerCrash, RefreshCcw, CalendarOff } from 'lucide-react';

export default function PastEventsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['past-events', page],
    queryFn: () => eventAPI.getPast(page, limit),
    retry: 1,
  });

  const events = data?.data?.events || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our completed events. Watch recordings and access resources from previous sessions.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-2xl mx-auto text-center px-4">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <CalendarOff className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Past Events Not Available
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              Stay tuned! Past events archive will be available soon. Check back later to access recordings and resources.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-lg max-w-2xl mx-auto text-center px-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <CalendarOff className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Events Found</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">We haven't archived any events yet. Check back after our upcoming events conclude.</p>
            <button
              onClick={() => window.location.href = '/events'}
              className="px-6 py-2.5 text-[#004aad] border-2 border-[#004aad]/20 rounded-xl font-semibold hover:bg-[#004aad]/5 transition-colors"
            >
              Browse Upcoming Events
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
