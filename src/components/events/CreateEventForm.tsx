

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Sparkles,
  Type,
  Tag,
  Calendar,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENT_CATEGORIES = [
  "Donation",
  "Cleanup",
  "Plantation",
  "Winter Relief",
  "Food Drive",
  "Health Camp",
  "Education",
];

const PHOTO_PRESETS = [
  {
    label: "Winter Clothes",
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Blanket Relief",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Cleanup",
    url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [today, setToday] = useState("");

  const mockOrganizerEmail = "mypit@mailinator.com";

  const [formData, setFormData] = useState({
    title: "",
    type: "Donation",
    date: "",
    location: "",
    thumbnailUrl: "",
    description: "",
  });

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newEventPayload = {
        ...formData,
        organizerEmail: mockOrganizerEmail,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:8000/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventPayload),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.detail || errData.message || "Failed to publish event.");
        } else {
          const errText = await res.text();
          throw new Error(`Server Error (${res.status}): ${errText.slice(0, 80)}`);
        }
      }

      const data = await res.json();
      console.log("Event Created Successfully:", data);

      // Trigger success toast notification
      toast.success("🎉 Event published successfully!");

      // Redirect after a short delay so the user sees the toast
      setTimeout(() => {
        router.push("/events");
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Submission error:", message);

      // Trigger error toast notification
      toast.error(`❌ ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm dark:shadow-xl dark:shadow-slate-950/50 rounded-2xl transition-colors">
      <CardContent className="p-6 sm:p-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200/60 dark:border-sky-500/20 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Social Service Drive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Create a Community Event
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Organize a local relief effort, environmental cleanup, or community support drive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Winter Clothes Distribution - Mirpur 10, Dhaka"
                className="pl-10 h-11 bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  if (value) {
                    setFormData((prev) => ({ ...prev, type: value }));
                  }
                }}
              >
                <SelectTrigger className="h-11 bg-slate-50/70 dark:bg-slate-950/60 border-sky-500/70 dark:border-sky-500/50 ring-1 ring-sky-500/20 focus:ring-sky-500 text-slate-900 dark:text-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Tag className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="focus:bg-sky-50 dark:focus:bg-sky-500/10 focus:text-sky-700 dark:focus:text-sky-300"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Event Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  min={today || undefined}
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10 h-11 bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400 dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Location / Venue <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mohammadpur Town Hall, Dhaka"
                className="pl-10 h-11 bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Thumbnail Image URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                required
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="pl-10 h-11 bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
              <span>Quick photo presets:</span>
              {PHOTO_PRESETS.map((preset, index) => (
                <React.Fragment key={preset.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        thumbnailUrl: preset.url,
                      }))
                    }
                    className="font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 underline-offset-2 hover:underline transition-colors"
                  >
                    {preset.label}
                  </button>
                  {index < PHOTO_PRESETS.length - 1 && <span>·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Event Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the purpose of the drive..."
              className="bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-sky-50/60 dark:bg-sky-950/30 px-4 py-3 text-xs border border-sky-200/70 dark:border-sky-800/40">
            <span className="text-slate-600 dark:text-slate-400">Organizer Email attached:</span>
            <span className="font-semibold text-sky-700 dark:text-sky-300">{mockOrganizerEmail}</span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold text-sm rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? "Publishing Event..." : "Publish Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

