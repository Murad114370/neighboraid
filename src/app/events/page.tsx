'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EventItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  organization: string;
  image?: string;
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Donation', 'Cleanup', 'Plantation', 'Winter Relief', 'Food Drive', 'Health Camp', 'Education'];

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${API_URL}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  // Format date nicely: e.g., "Sat, Nov 7, 2026"
  const formatEventDate = (dateString: string) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredEvents = events.filter((event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= today;

    const matchesCategory = selectedCategory === 'All'
      ? true
      : event.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organization.toLowerCase().includes(searchQuery.toLowerCase());

    return isUpcoming && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Chattogram Community Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover and join localized social work and relief initiatives across Chattogram division.
          </p>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 dark:bg-sky-500 dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search events, locations, or hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">
            Loading Chattogram events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-sm">
            No upcoming events found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event._id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-500/30 dark:hover:border-sky-500/30 overflow-hidden flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  {/* Card Image Banner Container */}
                  <div className="relative overflow-hidden h-48 bg-slate-100 dark:bg-slate-800">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Banner Available
                      </div>
                    )}

                    {/* Top-Left Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 text-[11px] font-bold rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                        🏷️ {event.category}
                      </span>
                    </div>

                    {/* Bottom-Left Date Pill Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-lg shadow-md border border-white/10 flex items-center gap-1.5">
                        📅 {formatEventDate(event.date)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {event.title}
                    </h3>

                    {/* Location line */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                      📍 {event.location}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      👤 <span>{event.organization}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/events/${event._id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white dark:text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-sky-600/20"
                  >
                    View Event Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}