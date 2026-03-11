import { redirect } from "next/navigation";

interface SearchParams {
  date?: string;
  time?: string;
}

interface ConfirmationPageProps {
  searchParams: SearchParams | Promise<SearchParams>;
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const sp = await searchParams;
  const { date, time } = sp;

  if (!date || !time) {
    redirect("/schedule");
  }

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
          <span className="text-2xl" aria-hidden>
            🎉
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Booking Confirmed
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          You&apos;re booked with Victoire Serruys. An invitation has been emailed
          to you.
        </p>

        <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Date
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {formattedDate}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Time
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {time}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

