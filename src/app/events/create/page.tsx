import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateEventForm from "@/components/events/CreateEventForm";

export const metadata = {
  title: "Create a Community Event | NeighborAid",
  description: "Organize a local relief effort or community support drive.",
};

export default function CreateEventPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 transition-colors overflow-hidden">
      {/* Subtle Sky Blue Top Ambient Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/10 via-sky-500/5 to-transparent dark:from-sky-500/15 dark:via-sky-500/5 dark:to-transparent" />

      <div className="relative max-w-2xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Upcoming Events</span>
          </Link>
        </div>

        {/* Main Form Card */}
        <CreateEventForm />
      </div>
    </main>
  );
}