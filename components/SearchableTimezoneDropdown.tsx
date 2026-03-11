'use client';

import { useMemo, useState } from "react";
import type { OffsetTimezoneOption } from "@/lib/timezoneOffsets";
import {
  DEFAULT_TIMEZONE_ID,
  UTC_05_TO_07_TIMEZONES,
} from "@/lib/timezoneOffsets";

interface SearchableTimezoneDropdownProps {
  valueId: string;
  onChange: (next: OffsetTimezoneOption) => void;
  label?: string;
}

export default function SearchableTimezoneDropdown({
  valueId,
  onChange,
  label = "Time zone",
}: SearchableTimezoneDropdownProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected =
    UTC_05_TO_07_TIMEZONES.find((t) => t.id === valueId) ??
    UTC_05_TO_07_TIMEZONES.find((t) => t.id === DEFAULT_TIMEZONE_ID) ??
    UTC_05_TO_07_TIMEZONES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UTC_05_TO_07_TIMEZONES;
    return UTC_05_TO_07_TIMEZONES.filter(
      (tz) =>
        tz.id.toLowerCase().includes(q) || tz.label.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-left text-sm text-zinc-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <span className="truncate">{selected.label}</span>
          <span className="text-zinc-400 dark:text-zinc-500">▾</span>
        </button>

        {open && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="p-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search time zones…"
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>

            <div className="max-h-56 overflow-auto p-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  No matches.
                </div>
              ) : (
                filtered.map((tz) => {
                  const isActive = tz.id === selected.id;
                  return (
                    <button
                      key={tz.id}
                      type="button"
                      onClick={() => {
                        onChange(tz);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={[
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                        isActive
                          ? "bg-orange-50 text-zinc-900 dark:bg-orange-500/10 dark:text-zinc-50"
                          : "text-zinc-800 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-900",
                      ].join(" ")}
                    >
                      <span className="truncate">{tz.label}</span>
                      <span className="ml-3 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        {tz.id}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

