import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/components/context/DarkModeContext";

function ToggleDarkMode() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark ? "true" : "false"}
      aria-label="Toggle dark mode"
      className={cn(
        "group focus-visible:ring-ring/40 relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full border p-0.5 shadow-inner transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none",
        "border-neutral-300/80 bg-neutral-200/80 hover:bg-neutral-200",
        "dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/80",
      )}
    >
      <span
        className={cn(
          "pointer-events-none grid h-7 w-7 place-items-center rounded-full bg-white shadow transition-all duration-300",
          isDark ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0",
        )}
      >
        {isDark ? (
          <Moon className="size-3.5 fill-indigo-100 text-indigo-600 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="size-3.5 fill-amber-100 text-amber-600 transition-transform duration-300 group-hover:rotate-12" />
        )}
      </span>
    </button>
  );
}

export default ToggleDarkMode;
