"use client";

import { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({
  loading = false,
  children,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={[
        "relative w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white",
        "shadow-md shadow-indigo-500/20",
        "hover:bg-indigo-500 active:bg-indigo-700",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "transition-all duration-150",
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
