interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Time" },
  { id: 3, label: "Confirm" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                isCompleted
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-500",
              ].join(" ")}
            >
              {step.id}
            </span>
            <span
              className={
                isActive || isCompleted
                  ? "text-zinc-900 dark:text-zinc-100"
                  : undefined
              }
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

