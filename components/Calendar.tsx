'use client';

import { useMemo, useState } from "react";

interface CalendarProps {
  value: string | null;
  onChange: (value: string) => void;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameIso(a: string | null, b: string) {
  return Boolean(a && a === b);
}

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar({ value, onChange }: CalendarProps) {
  const today = startOfDay(new Date());

  const initial = value ? new Date(`${value}T00:00:00`) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const monthTitle = useMemo(() => {
    const d = new Date(viewYear, viewMonth, 1);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }, [viewYear, viewMonth]);

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // JS: 0=Sun..6=Sat. Convert to Monday-first index (0=Mon..6=Sun)
    const firstDow = first.getDay();
    const offset = (firstDow + 6) % 7;

    const out: Array<{ iso: string; day: number } | null> = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      out.push({ iso: toIsoDate(d), day });
    }
    return out;
  }, [viewYear, viewMonth]);

  function isDisabled(iso: string) {
    const d = startOfDay(new Date(`${iso}T00:00:00`));
    const isPast = d < today;
    const dow = d.getDay(); // 0 Sun, 6 Sat
    const isWeekend = dow === 0 || dow === 6;
    return isPast || isWeekend;
  }

  function prevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function nextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Date
      </label>

      <div className="rounded-2xl bg-slate-900 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-sm text-slate-100 transition hover:bg-slate-700"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-sm font-semibold text-white">
            {monthTitle}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-sm text-slate-100 transition hover:bg-slate-700"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-300">
          {weekdayLabels.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((cell, idx) => {
            if (!cell) return <div key={idx} className="h-9" />;

            const disabled = isDisabled(cell.iso);
            const selected = isSameIso(value, cell.iso);

            return (
              <button
                key={cell.iso}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) onChange(cell.iso);
                }}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition",
                  disabled
                    ? "cursor-not-allowed bg-slate-800/60 text-slate-500"
                    : selected
                    ? "bg-white text-slate-900 shadow-sm"
                    : "bg-slate-800/40 text-white hover:bg-slate-700",
                ].join(" ")}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

