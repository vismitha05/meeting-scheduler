'use client';

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { generateTimeSlots } from "@/lib/generateTimeSlots";
import {
  convertTimeBetweenOffsets,
  getDefaultTimezoneOption,
} from "@/lib/timezoneOffsets";

interface TimeSlotsProps {
  selectedDate: string | null;
  timezoneOffsetMinutes?: number;
  timezoneLabel?: string;
}

export default function TimeSlots({
  selectedDate,
  timezoneOffsetMinutes,
  timezoneLabel,
}: TimeSlotsProps) {
  const router = useRouter();
  const slots = useMemo(() => generateTimeSlots(), []);

  const canPickTime = Boolean(selectedDate);
  const baseOffsetMinutes = getDefaultTimezoneOption().offsetMinutes; // slots are authored in UTC+05:30
  const displayOffsetMinutes = timezoneOffsetMinutes ?? baseOffsetMinutes;

  if (!canPickTime) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        Select a date to see available times.
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        No available time slots right now.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 items-center rounded-full bg-zinc-100 px-2 text-[11px] font-medium dark:bg-zinc-800">
            Google Meet
          </span>
          <span className="text-zinc-400 dark:text-zinc-600">•</span>
          <span className="text-[11px] font-medium">30 mins</span>
        </div>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Available times
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((baseValue) => {
          const displayValue = convertTimeBetweenOffsets({
            time: baseValue,
            fromOffsetMinutes: baseOffsetMinutes,
            toOffsetMinutes: displayOffsetMinutes,
          });
          return (
          <button
            key={`${baseValue}-${displayValue}`}
            type="button"
            onClick={() => {
              const params = new URLSearchParams({
                date: selectedDate!,
                time: displayValue,
              });
              if (timezoneLabel) params.set("timezone", timezoneLabel);
              router.push(`/booking?${params.toString()}`);
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-300 bg-white text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-900/60 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-50/60 dark:hover:bg-zinc-800"
          >
            {displayValue}
          </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}

