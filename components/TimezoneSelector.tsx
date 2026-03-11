'use client';

import { getCommonTimezones } from "@/lib/timezone";

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimezoneSelector({
  value,
  onChange,
}: TimezoneSelectorProps) {
  const timezones = getCommonTimezones();

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Time zone
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/10"
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}

