"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  ArrowUp, 
  Mail, 
  MapPin, 
  Phone, 
  Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [year, setYear] = useState<number | string>("2026");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-sky-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-sky-100 dark:border-sky-950 text-slate-700 dark:text-slate-300">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-sky-400/10 blur-[130px] rounded-full pointer-events-none dark:bg-sky-500/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-sky-200/60 dark:border-sky-900/40">
          
          {/* Brand & Mission Statement */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm shadow-sky-500/30">
                <HeartHandshake aria-hidden="true" className="size-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Neighbor<span className="text-sky-500">Aid</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Empowering local communities across Bangladesh through transparent social service drives—from winter warmth distribution to urban greening and food relief.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-400">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Upcoming Events", href: "/events" },
                { label: "Create an Event", href: "/create-event" },
                { label: "Joined Events", href: "/joined-events" },
                { label: "Manage Events", href: "/manage-events" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Initiatives */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-400">
              Initiatives
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Winter Blanket Drives</li>
              <li>Flood Relief Rations</li>
              <li>Urban Tree Plantation</li>
              <li>Free Health Camps</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 dark:text-sky-400">
              Get in Touch
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="size-4 text-sky-500 shrink-0" />
                <span>Bohaddarhat & GEC Circle, Chattogram</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="size-4 text-sky-500 shrink-0" />
                <a href="mailto:support@neighboraid.org" className="hover:text-sky-600 transition-colors">
                  support@neighboraid.org
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="size-4 text-sky-500 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Policy Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1">
            © {year} NeighborAid. Built with{" "}
            <Heart className="size-3.5 text-rose-500 fill-rose-500" /> for local communities.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-sky-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sky-600 transition-colors">
              Terms of Service
            </Link>
            
            {/* Scroll to Top Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              title="Scroll to top"
              aria-label="Scroll to top"
              className="size-8 rounded-full border-sky-200 bg-white/80 hover:bg-sky-100 hover:text-sky-900 dark:border-sky-800 dark:bg-slate-900 dark:hover:bg-sky-950 transition-all shadow-xs"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>

      </div>
    </footer>
  );
}