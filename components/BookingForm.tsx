'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Calendar from "@/components/Calendar";
import TimeSlots from "@/components/TimeSlots";
import SearchableTimezoneDropdown from "@/components/SearchableTimezoneDropdown";
import { generateSlots } from "@/lib/generateSlots";
import {
  DEFAULT_TIMEZONE_ID,
  type OffsetTimezoneOption,
  getDefaultTimezoneOption,
} from "@/lib/timezoneOffsets";

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<OffsetTimezoneOption>(
    getDefaultTimezoneOption(),
  );
  const [time, setTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const qpDate = searchParams.get("date");
    const qpTime = searchParams.get("time");
    if (qpDate && !date) setDate(qpDate);
    if (qpTime && !time) setTime(qpTime);
  }, [searchParams, date, time]);

  const slots = useMemo(
    () =>
      generateSlots({
        timezone: timezone.id,
        intervalMinutes: 30,
        startHour: 9,
        endHour: 17,
      }),
    [timezone],
  );

  const canSubmit =
    !!name && !!email && !!date && !!time && !!timezone && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !date || !time) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          notes,
          date,
          time,
          timezone: timezone.label,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      const params = new URLSearchParams({
        name,
        date,
        time,
        timezone: timezone.label,
      });

      router.push(`/confirmation?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create booking. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guest name"
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="guest@example.com"
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="lg:pr-2">
          <Calendar value={date} onChange={(next) => setDate(next)} />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 lg:pl-2">
          <div className="space-y-3">
            <SearchableTimezoneDropdown
              valueId={timezone.id ?? DEFAULT_TIMEZONE_ID}
              onChange={(next) => setTimezone(next)}
            />
            <TimeSlots
              selectedDate={date}
              timezoneOffsetMinutes={timezone.offsetMinutes}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Share an agenda or any context for the meeting."
          className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
        />
      </div>

      {error && (
        <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          You&apos;ll be able to review the details on the next screen.
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
        >
          {isSubmitting ? "Booking…" : "Review & confirm"}
        </button>
      </div>
    </form>
  );
}

