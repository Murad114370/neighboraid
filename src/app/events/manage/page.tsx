"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Calendar, MapPin, Tag, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreatedEvent {
  _id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  thumbnailUrl: string;
  description: string;
  organizerEmail: string;
  createdAt: string;
}

export default function ManageEventPage() {
  const [events, setEvents] = useState<CreatedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Temporary mock organizer email (match this with what you use in CreateEventForm)
  const mockOrganizerEmail = "mypit@mailinator.com";

  // Fetch events created by this organizer on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/events/organizer/${mockOrganizerEmail}`);
      if (!res.ok) throw new Error("Failed to fetch your created events.");
      
      const data = await res.json();
      setEvents(data);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:8000/events/create/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event.");

      toast.success("🗑️ Event deleted successfully!");
      // Remove deleted event from UI state instantly
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-500/20 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Manage Your Events
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View, track, and manage all community events you have published.
          </p>
        </div>
        <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300">
          Organizer: <span className="font-semibold">{mockOrganizerEmail}</span>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          Loading your events...
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-12 text-center">
          <CardContent className="space-y-3">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No events found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You haven't created any community events yet. Head over to the create form to publish your first drive!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Events Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event._id}
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                {/* Event Thumbnail */}
                {event.thumbnailUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={event.thumbnailUrl}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-sky-600 dark:text-sky-400">
                      {event.type}
                    </span>
                  </div>
                )}

                <CardContent className="p-5 space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sky-500 shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sky-500 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {event.description}
                  </p>
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Added: {new Date(event.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 gap-1.5 h-9 px-3 rounded-xl cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}