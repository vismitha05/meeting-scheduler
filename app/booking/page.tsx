import StepIndicator from "@/components/StepIndicator";
import BookingDetailsForm from "@/components/BookingDetailsForm";
import { redirect } from "next/navigation";

interface BookingPageProps {
  searchParams?:
    | { date?: string; time?: string; timezone?: string }
    | Promise<{ date?: string; time?: string; timezone?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const sp = searchParams ? await searchParams : undefined;
  if (!sp?.date || !sp?.time || !sp?.timezone) {
    redirect("/schedule");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              Book a meeting
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Choose a date, time, and time zone. We&apos;ll send you to a
              confirmation screen once it&apos;s booked.
            </p>
          </div>
          <StepIndicator currentStep={2} />
        </header>

        <BookingDetailsForm />
      </main>
    </div>
  );
}

