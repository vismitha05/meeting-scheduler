export interface OffsetTimezoneOption {
  id: string;
  label: string;
  offsetMinutes: number;
}

export const UTC_05_TO_07_TIMEZONES: OffsetTimezoneOption[] = [
  {
    id: "UTC+05:00",
    label: "UTC+05:00 Karachi, Tashkent",
    offsetMinutes: 5 * 60,
  },
  {
    id: "UTC+05:30",
    label: "UTC+05:30 New Delhi, Mumbai, Calcutta",
    offsetMinutes: 5 * 60 + 30,
  },
  {
    id: "UTC+05:45",
    label: "UTC+05:45 Kathmandu",
    offsetMinutes: 5 * 60 + 45,
  },
  {
    id: "UTC+06:00",
    label: "UTC+06:00 Dhaka, Almaty",
    offsetMinutes: 6 * 60,
  },
  {
    id: "UTC+06:30",
    label: "UTC+06:30 Yangon (Rangoon)",
    offsetMinutes: 6 * 60 + 30,
  },
  {
    id: "UTC+07:00",
    label: "UTC+07:00 Bangkok, Hanoi, Jakarta",
    offsetMinutes: 7 * 60,
  },
];

export const DEFAULT_TIMEZONE_ID = "UTC+05:30";

export function getDefaultTimezoneOption(): OffsetTimezoneOption {
  return (
    UTC_05_TO_07_TIMEZONES.find((tz) => tz.id === DEFAULT_TIMEZONE_ID) ??
    UTC_05_TO_07_TIMEZONES[0]
  );
}

export function parseTimeToMinutes(time: string): number {
  const [hh, mm] = time.split(":");
  const h = Number(hh);
  const m = Number(mm);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function convertTimeBetweenOffsets(options: {
  time: string;
  fromOffsetMinutes: number;
  toOffsetMinutes: number;
}): string {
  const base = parseTimeToMinutes(options.time);
  const delta = options.toOffsetMinutes - options.fromOffsetMinutes;
  return minutesToTime(base + delta);
}

