"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Sparkles, Calendar, ArrowUpRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
  stats: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Winter Warmth & Blanket Distribution",
    category: "Winter Relief",
    location: "Mirpur & Mohammadpur",
    date: "January 2026",
    image: "/winder_bd_images.jpg",
    stats: "1,200+ Blankets Distributed",
  },
  {
    id: "2",
    title: "Urban Tree Plantation & Green Drive",
    category: "Environment",
    location: "Community Park Zone",
    date: "October 2025",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    stats: "500+ Saplings Planted",
  },
 
  {
    id: "3",
    title: "Neighborhood Clean-Up Campaign",
    category: "Sanitation",
    location: "Uttara Sector 7",
    date: "November 2025",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    stats: "3 Tons Waste Cleared",
  },
  {
    id: "4",
    title: "Free Community Health & Eye Camp",
    category: "Healthcare",
    location: "Gulshan Community Center",
    date: "September 2025",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
    stats: "400+ Patients Treated",
  },
   {
    id: "5",
    title: "Flood Relief & Emergency Food Distribution",
    category: "Food Support",
    location: "Feni & Noakhali Area",
    date: "24 Aug 2024",
    image: "/feni.jpg", // Replace with your saved filename for 1st pic
    stats: "1,500+ Ration Packages",
  },
  {
    id: "6",
    title: "Emergency Relief Truck Dispatch",
    category: "Food Support",
    location: "Comilla & Eastern Region",
    date: "28 Aug 2024",
    image: "/comilla.jpg", // Replace with your saved filename for 2nd pic
    stats: "2,000+ Relief Supplies",
  },
];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Winter Relief", "Environment", "Food Support", "Healthcare", "Education"];

  const filteredItems = activeFilter === "All" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  return (
    <section 
      aria-label="Community service gallery"
      className="relative overflow-hidden bg-gradient-to-b from-sky-50/40 via-white to-sky-50/60 py-20 sm:py-28 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-sky-100 dark:border-sky-950"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-sky-400/10 blur-[130px] rounded-full pointer-events-none dark:bg-sky-500/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 text-xs font-semibold tracking-wide dark:bg-sky-950/80 dark:border-sky-800 dark:text-sky-300 mb-4 shadow-xs">
            <Sparkles className="size-3.5 text-sky-500 animate-pulse" />
            <span>Moments of Change</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Captured Impact Across <br />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Our Neighborhoods
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            A visual showcase of our dedicated volunteers and community members working together to build a brighter, warmer future.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === category
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-105"
                  : "bg-sky-100/60 text-slate-700 hover:bg-sky-200/70 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-sky-200/50 dark:border-sky-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl border border-sky-200/60 bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-sky-400 hover:shadow-xl dark:border-sky-900/60 dark:hover:border-sky-700"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-sky-900 backdrop-blur-md shadow-sm dark:bg-slate-950/90 dark:text-sky-300 border border-white/20">
                    <Heart className="size-3 text-sky-500" />
                    {item.category}
                  </span>
                </div>

                {/* Top Right Action Arrow Icon */}
                <div className="absolute top-4 right-4 z-10 size-9 rounded-full bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
                  <ArrowUpRight className="size-4" />
                </div>

                {/* Bottom Overlay Details on Image */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-200 mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-sky-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-sky-400" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1 group-hover:text-sky-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer / Impact Metric Banner */}
              <div className="px-5 py-3.5 bg-sky-50/50 dark:bg-slate-900/90 border-t border-sky-100 dark:border-sky-900/50 flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-300">
                <span>Impact Highlight</span>
                <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-200/60 dark:border-sky-800">
                  {item.stats}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}