
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    PlusCircle,
    Tag,
    Calendar,
    MapPin,
    User,
    Edit3,
    Trash2,
    AlertCircle,
    X,
} from "lucide-react";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EVENT_CATEGORIES = [
    "Donation",
    "Cleanup",
    "Plantation",
    "Winter Relief",
    "Food Drive",
    "Health Camp",
    "Education",
];

interface CreatedEvent {
    _id: string;
    title: string;
    type: string;
    date: string;
    location: string;
    thumbnailUrl: string;
    description: string;
    organizerEmail: string;
    organizerName?: string;
    createdAt: string;
}

export default function ManageEventPage() {
    const [events, setEvents] = useState<CreatedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
 
    // Modal states for View and Edit
    const [viewEvent, setViewEvent] = useState<CreatedEvent | null>(null);
    const [editEvent, setEditEvent] = useState<CreatedEvent | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const mockOrganizerEmail = "mypit@mailinator.com";

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `http://localhost:8000/events/organizer/${mockOrganizerEmail}`
            );
            if (!res.ok) throw new Error("Failed to fetch your created events.");

            const data = await res.json();
            setEvents(data);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Error fetching events.";
            toast.error(`❌ ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // VIEW: Fetch fresh event details from backend and open View Modal
    const handleView = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:8000/events/${id}`);
            if (!res.ok) throw new Error("Could not load event details.");
            const data = await res.json();

            // Normalize fields in case it came from feed schema or create schema
            setViewEvent({
                _id: data._id,
                title: data.title,
                type: data.type || data.category,
                date: data.date,
                location: data.location,
                thumbnailUrl: data.thumbnailUrl || data.image,
                description: data.description,
                organizerEmail: data.organizerEmail || data.organization,
                createdAt: data.createdAt,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to load details.";
            toast.error(`❌ ${message}`);
        }
    };

    // EDIT: Submit updated fields via PUT /events/create/:id
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editEvent) return;

        setIsUpdating(true);
        try {
            const res = await fetch(
                `http://localhost:8000/events/create/${editEvent._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editEvent),
                }
            );

            if (!res.ok) throw new Error("Failed to update event.");

            toast.success("✅ Event updated successfully!");

            // Update UI state instantly
            setEvents((prev) =>
                prev.map((ev) => (ev._id === editEvent._id ? editEvent : ev))
            );
            setEditEvent(null);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to update event.";
            toast.error(`❌ ${message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    // DELETE: Remove via DELETE /events/create/:id
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const res = await fetch(`http://localhost:8000/events/create/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete event.");

            toast.success("🗑️ Event deleted successfully!");
            setEvents((prev) => prev.filter((event) => event._id !== id));
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Failed to delete event.";
            toast.error(`❌ ${message}`);
        }
    };

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

    return (
        <div className="min-h-screen bg-[#f4f7f6] dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Top Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Manage Events</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">View and organize your created community drives.</p>
                    </div>

                    <Link href="/events/create">
                        <Button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm h-10 px-4 rounded-lg shadow-sm gap-2 cursor-pointer">
                            <PlusCircle className="h-4 w-4" />
                            <span>Create New Event</span>
                        </Button>
                    </Link>
                </div>

                {/* Loading / Empty / Grid */}
                {isLoading ? (
                    <div className="text-center py-20 text-sm text-slate-500 dark:text-slate-400">
                        Loading your events...
                    </div>
                ) : events.length === 0 ? (
                    <Card className="border-dashed border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 rounded-2xl p-12 text-center">
                        <CardContent className="space-y-3">
                            <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                No events published yet
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                Click &ldquo;Create New Event&rdquo; above to launch your first
                                community initiative.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...events]
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => (
                            <Card
                                key={event._id}
                                className="bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                        <img
                                            src={
                                                event.thumbnailUrl ||
                                                "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                                            }
                                            alt={event.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-sky-700 dark:text-sky-400 shadow-sm">
                                            <Tag className="h-3 w-3" />
                                            <span>{event.type}</span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-white shadow-sm">
                                            <Calendar className="h-3 w-3 text-slate-300" />
                                            <span>{formatDisplayDate(event.date)}</span>
                                        </div>
                                    </div>

                                    <CardContent className="p-5 space-y-3">
                                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {event.description}
                                        </p>
                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">
                                                {event.organizerName || event.organizerEmail}
                                            </span>
                                        </div>
                                    </CardContent>
                                </div>

                                {/* Action Buttons: View, Edit, Delete */}
                                <div className="px-5 pb-5 pt-1 grid grid-cols-12 gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleView(event._id)}
                                        className="col-span-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs h-9 rounded-lg cursor-pointer"
                                    >
                                        View
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setEditEvent(event)}
                                        className="col-span-3 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 font-semibold text-xs h-9 px-2 rounded-lg gap-1 cursor-pointer"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Edit</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => handleDelete(event._id)}
                                        className="col-span-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-xs h-9 px-2 rounded-lg gap-1 cursor-pointer"
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

            {/* ==================== VIEW DETAILS MODAL ==================== */}
            {viewEvent && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
                        <div className="relative h-56 w-full bg-slate-200 dark:bg-slate-800">
                            <img
                                src={viewEvent.thumbnailUrl}
                                alt={viewEvent.title}
                                className="h-full w-full object-cover"
                            />
                            <button
                                onClick={() => setViewEvent(null)}
                                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <span className="absolute bottom-3 left-3 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {viewEvent.type}
                            </span>
                        </div>

                        <div className="p-6 space-y-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                                {viewEvent.title}
                            </h2>

                            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-teal-600" />
                                    <span>{formatDisplayDate(viewEvent.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    <span className="truncate">{viewEvent.location}</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {viewEvent.description}
                            </p>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                                <span>Organizer: {viewEvent.organizerEmail}</span>
                                <Button
                                    size="sm"
                                    onClick={() => setViewEvent(null)}
                                    className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg cursor-pointer"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== EDIT EVENT MODAL ==================== */}
            {editEvent && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                                Edit Event
                            </h2>
                            <button
                                onClick={() => setEditEvent(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Event Title</Label>
                                <Input
                                    required
                                    value={editEvent.title}
                                    onChange={(e) =>
                                        setEditEvent({ ...editEvent, title: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Category</Label>
                                    <select
                                        value={editEvent.type}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, type: e.target.value })
                                        }
                                        className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm"
                                    >
                                        {EVENT_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Date</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={editEvent.date}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, date: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Location</Label>
                                <Input
                                    required
                                    value={editEvent.location}
                                    onChange={(e) =>
                                        setEditEvent({ ...editEvent, location: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Thumbnail URL</Label>
                                <Input
                                    type="url"
                                    required
                                    value={editEvent.thumbnailUrl}
                                    onChange={(e) =>
                                        setEditEvent({ ...editEvent, thumbnailUrl: e.target.value })
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Description</Label>
                                <Textarea
                                    rows={3}
                                    required
                                    value={editEvent.description}
                                    onChange={(e) =>
                                        setEditEvent({ ...editEvent, description: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditEvent(null)}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

