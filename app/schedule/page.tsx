'use client';

import { useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import TimeSlots from "@/components/TimeSlots";
import SearchableTimezoneDropdown from "@/components/SearchableTimezoneDropdown";
import {
  DEFAULT_TIMEZONE_ID,
  type OffsetTimezoneOption,
  getDefaultTimezoneOption,
} from "@/lib/timezoneOffsets";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<OffsetTimezoneOption>(
    getDefaultTimezoneOption(),
  );

  const dateLabel = useMemo(() => formatDate(selectedDate), [selectedDate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="w-full max-w-5xl rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            What time works for you?
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Showing times for{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {dateLabel}
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
          <div className="lg:pr-2">
            <Calendar value={selectedDate} onChange={setSelectedDate} />
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 lg:pl-2">
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full bg-zinc-100 px-2 text-[11px] font-medium dark:bg-zinc-800">
                    Google Meet
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-600">•</span>
                  <span className="text-[11px] font-medium">30 mins</span>
                </div>
              </div>

              <SearchableTimezoneDropdown
                valueId={timezone.id ?? DEFAULT_TIMEZONE_ID}
                onChange={(next) => setTimezone(next)}
              />

              <TimeSlots
                selectedDate={selectedDate}
                timezoneOffsetMinutes={timezone.offsetMinutes}
                timezoneLabel={timezone.label}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

