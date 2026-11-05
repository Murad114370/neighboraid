
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  joinedCount?: number;
}

// --- Temporary Session Helper ---
function useSession() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  return { data: user ? { user } : null };
}

function EventDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  // Better Auth session hook
  const { data: session } = useSession();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [joining, setJoining] = useState<boolean>(false);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setVolunteerCount(data.joinedCount || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching event details:', err);
        setLoading(false);
      });
  }, [id, API_URL]);

  // Helper function to format date: e.g., "Sun, Nov 15, 2026"
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

  const handleJoinEvent = async () => {
    // If not logged in, redirect to login page
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (isJoined || joining || !event) return;

    setJoining(true);
    try {
      const res = await fetch(`${API_URL}/joined-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          eventTitle: event.title,
          userEmail: session.user.email,
          userName: session.user.name,
          joinedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setIsJoined(true);
        setVolunteerCount((prev) => prev + 1);
      } else {
        const errorData = await res.json();
        if (errorData.message?.includes('already joined')) {
          setIsJoined(true);
        }
      }
    } catch (err) {
      console.error('Failed to join event:', err);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Event not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-xs text-sky-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb */}
        <Link href="/events" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 mb-4 transition-colors">
          &larr; Upcoming Events
        </Link>

        {/* Hero Card Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 h-[340px] md:h-[400px]">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Category Badge top left */}
          <div className="absolute top-5 left-6">
            <span className="px-3.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-slate-200/50 shadow-sm">
              ♡ {event.category}
            </span>
          </div>

          {/* Hero Banner Title & Info */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-200 mt-2 font-medium">
              <span className="flex items-center gap-1">
                📍 {event.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                📅 {formatEventDate(event.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Action & Volunteer Bar */}
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              👥
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {volunteerCount} Volunteers Joined
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign up to join hands for this drive
              </p>
            </div>
          </div>

          {/* Right Side Join Event Button */}
          <button
            onClick={handleJoinEvent}
            disabled={joining || isJoined}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
              isJoined
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-95'
            }`}
          >
            ♡ {isJoined ? 'Joined Event' : joining ? 'Joining...' : 'Join Event'}
          </button>
        </div>

        {/* Details Grid: Left Main Content / Right Organizer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Main Info Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                About this Social Initiative
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Volunteer Guidelines */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                VOLUNTEER GUIDELINES
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                <li>Please arrive 15 minutes before the scheduled time at the designated location.</li>
                <li>Wear comfortable clothing suitable for physical social work and distribution.</li>
                <li>Bring any pre-coordinated relief packages or distribution items if requested.</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Initiative Organizer Card */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                INITIATIVE ORGANIZER
              </h4>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-700 dark:text-slate-200">
                  {event.organization ? event.organization.charAt(0) : 'O'}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                    {event.organization}
                  </h5>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    organizer@neighboraid.org
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>🛡️</span> Verified Platform Member
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading details...</div>}>
      <EventDetailsContent />
    </Suspense>
  );
}

