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
}

// 1. Move main event logic into an inner component
function EventDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    fetch(`${API_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching event details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading details...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Event not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-xs text-sky-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link href="/events" className="text-xs text-sky-600 hover:underline mb-6 inline-block">
        &larr; Back to Events
      </Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-72 object-cover" />
        )}
        <div className="p-8">
          <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950 text-rose-500 text-xs font-semibold rounded-full">
            {event.category}
          </span>
          <h1 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">{event.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{event.location} • {event.date}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">{event.description}</p>
          
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            Organized by <span className="font-semibold text-slate-700 dark:text-slate-200">{event.organization}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Export page wrapped in <Suspense>
export default function EventDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading details...</div>}>
      <EventDetailsContent />
    </Suspense>
  );
}