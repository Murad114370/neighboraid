"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Tag, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface JoinedEvent {
  _id: string;
  eventId: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
  description: string;
  organization: string;
  joinedAt: string;
}

const JoinedEventPage = () => {
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Same session source as the Navbar (Better Auth)
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userEmail = session?.user?.email;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Wait until Better Auth finishes checking the session
    if (sessionLoading) return;

    // Not logged in: nothing to fetch
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const fetchJoinedEvents = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${API_URL}/joined-events/${encodeURIComponent(userEmail)}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch joined events.");

        const data = await res.json();
        setJoinedEvents(data);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Error loading joined events.";
        toast.error(`❌ ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJoinedEvents();
  }, [sessionLoading, userEmail, API_URL]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatJoinDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500s border border-sky-200 dark:border-sky-500 text-xs font-bold text-sky-600 dark:text-sky-400 mb-3">
            <span>My Volunteer Coordinations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Joined Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here are all the social development and community service drives you have signed up for, sorted by event date.
          </p>
        </div>

        {/* Loading / Not logged in / Empty / Cards Grid */}
        {isLoading || sessionLoading ? (
          <div className="text-center py-20 text-sm text-slate-500 dark:text-slate-400">
            Loading your joined events...
          </div>
        ) : !userEmail ? (
          <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 rounded-2xl p-12 text-center">
            <CardContent className="space-y-4">
              <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Please log in
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Log in to see the events you have joined.
              </p>
              <Link href="/login?redirect=%2Fevents%2Fjoined">
                <Button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg cursor-pointer">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : joinedEvents.length === 0 ? (
          <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 rounded-2xl p-12 text-center">
            <CardContent className="space-y-4">
              <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                No joined events yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Open any event from Upcoming Events and click &ldquo;Join Event&rdquo; to see it appear here.
              </p>
              <Link href="/events">
                <Button className="mt-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg cursor-pointer">
                  Explore Upcoming Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...joinedEvents]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <Card
                  key={event._id}
                  className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail & Overlays */}
                    <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={
                          event.image ||
                          "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-600 dark:text-rose-400 shadow-sm">
                        <Tag className="h-3 w-3" />
                        <span>{event.category}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-white shadow-sm">
                        <Calendar className="h-3 w-3 text-slate-300" />
                        <span>{formatDisplayDate(event.date)}</span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        📍 {event.location}
                      </div>

                      {/* Volunteer Status Box */}
                      <div className="flex items-start gap-2 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 p-2.5 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sky-300">
                            You have signed up as a verified volunteer for this initiative.
                          </p>
                          {event.joinedAt && (
                            <p className="text-[10px] opacity-80 mt-0.5 text-sky-300">
                              Joined {formatJoinDate(event.joinedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* View Event Button */}
                  <div className="p-5 pt-0">
                    <Link href={`/events/${event.eventId}`}>
                      <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs h-10 rounded-xl shadow-sm cursor-pointer">
                        View Event &rarr;
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedEventPage;