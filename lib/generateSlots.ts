interface GenerateSlotsOptions {
  timezone: string;
  startHour: number;
  endHour: number;
  intervalMinutes: number;
}

interface Slot {
  value: string;
  label: string;
}

export function generateSlots(options: GenerateSlotsOptions): Slot[] {
  const { startHour, endHour, intervalMinutes } = options;

  const slots: Slot[] = [];
  const date = new Date();
  date.setHours(startHour, 0, 0, 0);

  while (date.getHours() < endHour) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const value = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const label = `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;

    slots.push({ value, label });

    date.setMinutes(date.getMinutes() + intervalMinutes);
  }

  return slots;
}

