'use client';

import React, { useEffect, useState } from 'react';
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

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch individual event by ID from your Express backend
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/events/${id}`)
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

  const handleJoin = () => {
    // Example login check: if not logged in, redirect using Next.js router.push
    // const user = null; // Replace with your session user check
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }

    if (!event) return;

    const joinPayload = {
      eventId: event._id,
      eventTitle: event.title,
      joinedAt: new Date(),
    };

    fetch('http://localhost:8000/joined-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(joinPayload),
    })
      .then((res) => res.json())
      .then(() => {
        alert('Successfully joined the event!');
      })
      .catch((err) => console.error('Error joining event:', err));
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading event details...</div>;
  if (!event) return <div className="text-center py-20 text-gray-400">Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link href="/events" className="text-xs font-semibold text-sky-600 hover:underline mb-6 inline-block">
        &larr; Back to Upcoming Events
      </Link>

      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-80 object-cover rounded-2xl shadow-sm mb-6" />
      )}

      <span className="inline-block px-3 py-1 bg-rose-50 text-rose-500 text-xs font-medium rounded-full mb-3">
        {event.category}
      </span>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
      <p className="text-sm text-gray-500 mb-6">📍 {event.location} • 📅 {event.date}</p>
      <p className="text-gray-700 text-sm leading-relaxed mb-8">{event.description}</p>
      
      <button
        onClick={handleJoin}
        className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-3 px-6 rounded-xl transition-colors shadow-sm"
      >
        Join Event
      </button>
    </div>
  );
}