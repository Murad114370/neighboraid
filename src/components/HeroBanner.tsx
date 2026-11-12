
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatItemProps {
  icon: LucideIcon;
  category: string;
  targetValue: number;
  suffix: string;
  label: string;
  duration?: number;
}

const STATS_DATA: Omit<StatItemProps, "duration">[] = [
  {
    icon: Users,
    category: "Network",
    targetValue: 3200,
    suffix: "+",
    label: "Active Volunteers",
  },
  {
    icon: CheckCircle2,
    category: "Drives",
    targetValue: 450,
    suffix: "+",
    label: "Completed Projects",
  },
  {
    icon: Heart,
    category: "Reach",
    targetValue: 50000,
    suffix: "+",
    label: "Lives Impacted",
  },
  {
    icon: TrendingUp,
    category: "Trust",
    targetValue: 100,
    suffix: "%",
    label: "Direct Community Impact",
  },
];

function StatCard({
  icon: Icon,
  category,
  targetValue,
  suffix,
  label,
  duration = 2000,
}: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * targetValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [targetValue, duration]);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-sky-200/80 bg-white/90 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg dark:border-sky-800/60 dark:bg-slate-900/85 dark:hover:border-sky-600">
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {category}
          </span>
        </div>
        <h3 className="flex items-center text-2xl font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600 sm:text-3xl dark:text-white dark:group-hover:text-sky-400">
          <span>{count.toLocaleString()}</span>
          <span className="text-sky-500">{suffix}</span>
        </h3>
      </div>
      <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </p>
    </div>
  );
}

export default function HeroBanner() {
  const router = useRouter();

  // Handle protected routing check when clicking "Create an Event"
  const handleCreateEventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let user = null;
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        user = JSON.parse(savedUser);
      }
    } catch (err) {
      user = null;
    }

    if (!user) {
      toast.warn("🔒 Please log in first to create an event.");
      router.push(`/login?redirect=${encodeURIComponent("/events/create")}`);
      return;
    }

    // If logged in, proceed to the create event page
    router.push("/events/create");
  };

  return (
    <section
      aria-label="Community platform introduction"
      className="relative overflow-hidden border-b border-sky-200/60 py-16 sm:py-24 lg:py-28 dark:border-sky-900/50"
    >
      {/* Background Community Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-60 pointer-events-none transition-opacity duration-300"
        style={{ 
          backgroundImage: `url('/winder_bd_images.jpg')` 
        }}
      />

      {/* Translucent Glass Gradient Overlay for Both Themes */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/85 via-white/80 to-sky-50/80 dark:from-slate-950/90 dark:via-slate-900/85 dark:to-slate-950/90 pointer-events-none" />

      {/* Ambient Glow Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-sky-400/20 blur-[120px] dark:bg-sky-500/10"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Copy & Call to Actions */}
          <div className="text-left lg:col-span-7">
            
            {/* Tag Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/90 px-4 py-1.5 text-xs font-semibold tracking-wide text-sky-900 shadow-xs dark:border-sky-800 dark:bg-sky-950/90 dark:text-sky-300">
              <Sparkles className="size-3.5 text-sky-500 animate-pulse" />
              <span>Connecting Neighbors, Transforming Lives</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Unite for Impact. <br />
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Empower Every Neighborhood.
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-xl text-base font-normal leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
              Mobilize local resources, create meaningful social service campaigns, and connect with volunteers near you—from winter warmth initiatives to urban greening and food relief.
            </p>

            {/* Buttons */}
            <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center">
              <Button
                render={<Link href="/events" />}
                nativeButton={false}
                size="lg"
                className="h-12 rounded-xl bg-sky-500 px-7 font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-sky-600 active:scale-[0.98]"
              >
                Explore Upcoming Events
                <ArrowRight className="ml-2 size-4" />
              </Button>

              <Button
                onClick={handleCreateEventClick}
                variant="outline"
                size="lg"
                className="h-12 rounded-xl border-sky-200 bg-white/60 text-slate-800 backdrop-blur-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50 dark:border-sky-800 dark:bg-slate-900/60 dark:text-sky-200 dark:hover:bg-sky-950/50 cursor-pointer"
              >
                <CalendarPlus className="mr-2 size-4 text-sky-500" />
                Create an Event
              </Button>
            </div>

          </div>

          {/* Animated Statistics Side Panel */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {STATS_DATA.map((stat) => (
                <StatCard
                  key={stat.category}
                  icon={stat.icon}
                  category={stat.category}
                  targetValue={stat.targetValue}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

