export function generateTimeSlots(): string[] {
  const slots: string[] = [];

  let minutes = 16 * 60 + 30; // 16:30
  const end = 18 * 60; // 18:00 (exclusive)

  while (minutes < end) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
    );
    minutes += 15;
  }

  return slots;
}

