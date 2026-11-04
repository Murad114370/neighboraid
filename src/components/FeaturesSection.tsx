"use client";

import { 
  CalendarDays, 
  MapPin, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  BellRing, 
  type LucideIcon 
} from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    icon: CalendarDays,
    title: "Community Drives & Events",
    description: "Organize or join local social service campaigns effortlessly—from winter blanket distributions to urban tree plantations.",
    badge: "Core Service",
  },
  {
    icon: MapPin,
    title: "Regional Division & Filtering",
    description: "Find and filter initiatives precisely by your neighborhood, zone, or regional division (e.g., Mirpur, Mohammadpur).",
    badge: "Hyperlocal",
  },
  {
    icon: Users,
    title: "Volunteer Network",
    description: "Connect directly with passionate changemakers, coordinate tasks, and grow a supportive community ecosystem.",
    badge: "Collaboration",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Transparent",
    description: "Every campaign undergoes verification to ensure total transparency, secure tracking, and maximum community trust.",
    badge: "Secure",
  },
  {
    icon: HeartHandshake,
    title: "Joined Events Tracking",
    description: "Keep track of all the social drives you have signed up for, manage your schedules, and get timely updates.",
    badge: "Personalized",
  },
  {
    icon: BellRing,
    title: "Real-Time Updates",
    description: "Receive instant feedback notifications and alerts regarding schedule changes or new requirements in your area.",
    badge: "Instant",
  },
];

export default function FeaturesSection() {
  return (
    <section 
      aria-label="Platform features"
      className="relative overflow-hidden bg-white py-20 sm:py-28 dark:bg-slate-950 border-b border-sky-100 dark:border-sky-950 transition-colors"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-400/5 blur-[140px] rounded-full pointer-events-none dark:bg-sky-500/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-3">
            Platform Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Designed to Make Community Action <br />
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Simple, Transparent, and Impactful.
            </span>
          </p>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Everything you need to organize drives, mobilize neighbors, and track real-world results in one unified platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES_DATA.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-3xl border border-sky-100/80 bg-sky-50/40 p-8 shadow-xs backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-300 hover:bg-white hover:shadow-xl hover:shadow-sky-900/5 dark:border-sky-900/40 dark:bg-slate-900/60 dark:hover:border-sky-700 dark:hover:bg-slate-900"
              >
                <div>
                  {/* Top Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:bg-sky-600">
                      <Icon aria-hidden="true" className="size-6" />
                    </div>
                    {feature.badge && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                        {feature.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom subtle accent line */}
                <div className="mt-8 pt-4 border-t border-sky-100/60 dark:border-sky-900/40 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}