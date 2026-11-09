"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, User } from "lucide-react";

const RecentUpcoming = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch upcoming events from your backend
        fetch("http://localhost:8000/upcoming-events")
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching upcoming events:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg text-sky-500"></span>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                    Recent Upcoming Events
                </h2>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
                    Discover and join localized social work and relief initiatives.
                </p>
            </div>

            {events.length === 0 ? (
                <p className="text-center text-slate-400 py-10">
                    No upcoming events scheduled right now. Create one to see it appear here!
                </p>
            ) : (
                /* 3-Column Grid Layout matching your screenshot */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div 
                            key={event._id} 
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Card Header Image with Floating Badges */}
                            <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={event.thumbnailUrl} 
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                
                                {/* Top-Left Category Badge */}
                                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    {event.type}
                                </div>

                                {/* Bottom-Left Date Badge */}
                                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                                    <span>
                                        {new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body Details */}
                            <div className="p-6 flex flex-col flex-grow space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 line-clamp-1 mb-2">
                                        {event.title}
                                    </h3>
                                    
                                    {/* Location */}
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-1.5 mb-1">
                                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>

                                    {/* Description / Subtext */}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Organizer Footer Info */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <User className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                                    <span className="truncate">{event.organizerEmail}</span>
                                </div>

                                {/* Full-Width Action Button */}
                                <div className="pt-2">
                                    <Link 
                                        href={`/events/${event._id}`} 
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all text-center"
                                    >
                                        View Event Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RecentUpcoming;