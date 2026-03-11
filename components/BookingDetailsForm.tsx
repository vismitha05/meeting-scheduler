'use client';

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

type FormValues = {
  firstName: string;
  surname: string;
  email: string;
};

function formatDate(isoDate: string) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "";
  const location = "Google Meet";

  const meetingIsSelected = Boolean(date && time);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      surname: "",
      email: "",
    },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const details = useMemo(
    () => [
      { label: "Date", value: date ? formatDate(date) : "—" },
      { label: "Time", value: time || "—" },
      { label: "Location", value: location },
    ],
    [date, time],
  );

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!meetingIsSelected) {
      setSubmitError("Please select a date and time first.");
      return;
    }
    const timezone = searchParams.get("timezone");
    if (!timezone) {
      setSubmitError("Missing timezone. Please go back and select a time zone.");
      return;
    }

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: values.firstName.trim(),
        lastName: values.surname.trim(),
        email: values.email,
        date,
        time,
        timezone,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error || "Booking failed. Please try again.");
      return;
    }

    const data = (await res.json().catch(() => null)) as
      | { success: true; booking: { date: string; time: string; timezone: string } }
      | { success: false; error?: string }
      | null;

    const confirmedDate = data && "booking" in data ? data.booking.date : date;
    const confirmedTime = data && "booking" in data ? data.booking.time : time;

    const params = new URLSearchParams({
      date: confirmedDate,
      time: confirmedTime,
    });

    router.replace(`/confirmation?${params.toString()}`);
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-900 px-5 py-4 text-slate-50 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Meeting details
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {details.map((item) => (
            <div key={item.label} className="rounded-xl bg-slate-800/60 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
                {item.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
        {!meetingIsSelected && (
          <p className="mt-3 text-xs text-slate-300">
            Tip: pick a time first (this page expects `?date=YYYY-MM-DD&time=HH:MM`).
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              First Name
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            {errors.firstName && (
              <p className="text-sm text-rose-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Surname
            </label>
            <input
              {...register("surname", { required: "Surname is required" })}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            {errors.surname && (
              <p className="text-sm text-rose-500">{errors.surname.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          {errors.email && (
            <p className="text-sm text-rose-500">{errors.email.message}</p>
          )}
        </div>

        {submitError && <p className="text-sm text-rose-500">{submitError}</p>}

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-10 items-center justify-center rounded-full bg-orange-500 px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Confirming…" : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}

