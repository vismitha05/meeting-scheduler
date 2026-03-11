import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 font-sans dark:bg-black">
      <main className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white/80 p-10 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            Meeting Scheduler
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Schedule meetings without the back-and-forth.
          </h1>
          <p className="text-pretty text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Share a link, let guests pick a time, and get instant confirmation.
            Time zones are handled automatically so everyone stays in sync.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/schedule"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Start booking
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No sign up required. Just pick a time.
          </p>
        </div>
      </main>
    </div>
  );
}
