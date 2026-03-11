export interface TimezoneOption {
  value: string;
  label: string;
}

const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: "Pacific/Honolulu", label: "Pacific Time (US) – Honolulu" },
  { value: "America/Los_Angeles", label: "Pacific Time (US) – Los Angeles" },
  { value: "America/Denver", label: "Mountain Time (US) – Denver" },
  { value: "America/Chicago", label: "Central Time (US) – Chicago" },
  { value: "America/New_York", label: "Eastern Time (US) – New York" },
  { value: "Europe/London", label: "GMT – London" },
  { value: "Europe/Paris", label: "Central European – Paris" },
  { value: "Asia/Dubai", label: "Gulf Standard – Dubai" },
  { value: "Asia/Kolkata", label: "India Standard – Kolkata" },
  { value: "Asia/Singapore", label: "Singapore – Singapore" },
  { value: "Asia/Tokyo", label: "Japan Standard – Tokyo" },
  { value: "Australia/Sydney", label: "Australia Eastern – Sydney" },
];

export function getDefaultTimezone(): string {
  if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (resolved) return resolved;
  }
  return "UTC";
}

export function getCommonTimezones(): TimezoneOption[] {
  const current = getDefaultTimezone();
  const exists = COMMON_TIMEZONES.some((tz) => tz.value === current);

  if (!exists && current) {
    return [
      {
        value: current,
        label: `${current} (current)`,
      },
      ...COMMON_TIMEZONES,
    ];
  }

  return COMMON_TIMEZONES;
}

