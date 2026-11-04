"use client";

import { useState } from "react";
import { Mail, Send, Sparkles, CheckCircle2, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  function handleUnsubscribe() {
    setSubscribed(false);
    setEmail("");
  }

  return (
    <section
      aria-label="Newsletter subscription"
      className="relative overflow-hidden bg-gradient-to-b from-sky-50/50 via-white to-sky-50/80 py-20 sm:py-28 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-sky-100 dark:border-sky-950"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-sky-400/10 blur-[140px] rounded-full pointer-events-none dark:bg-sky-500/5" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-sky-200/80 bg-white/80 p-8 sm:p-12 lg:p-16 shadow-xl shadow-sky-900/5 backdrop-blur-xl dark:border-sky-900/60 dark:bg-slate-900/80">
          
          <div className="mx-auto max-w-2xl text-center">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-200/80 text-sky-900 text-xs font-semibold tracking-wide dark:bg-sky-950/90 dark:border-sky-800 dark:text-sky-300 mb-6 shadow-xs">
              <Sparkles className="size-3.5 text-sky-500 animate-pulse" />
              <span>Stay Connected With Your Neighborhood</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
              Never Miss an Upcoming <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Community Drive.
              </span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal">
              Subscribe to our weekly dispatch to receive verified updates on local winter clothing drives, food relief campaigns, and green initiatives near you.
            </p>

            {/* Interactive Subscription / Unsubscribe Toggle Box */}
            {subscribed ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200 animate-in fade-in zoom-in-95 duration-300 shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Thank you for subscribing!</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Subscribed as <span className="font-semibold underline">{email}</span>
                    </p>
                  </div>
                </div>

                {/* Unsubscribe Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUnsubscribe}
                  className="border-emerald-300 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-900/50 shrink-0 text-xs rounded-xl"
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Unsubscribe
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="size-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-sky-200 bg-sky-50/40 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all dark:border-sky-800/80 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg shadow-sky-500/25 h-12 px-7 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  Subscribe
                  <Send className="ml-2 size-4" />
                </Button>
              </form>
            )}

            {/* Privacy Trust Footer */}
            <div className="mt-8 pt-6 border-t border-sky-100/60 dark:border-sky-900/40 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Shield className="size-3.5 text-sky-500" />
              <span>No spam, ever. Unsubscribe anytime with a single click.</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}