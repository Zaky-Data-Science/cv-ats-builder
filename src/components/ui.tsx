import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen antarmuka dasar.
 *
 * Ditulis sendiri dengan Tailwind alih-alih memakai pustaka komponen agar
 * seluruh markup yang dihasilkan dapat ditelusuri - hal yang relevan untuk
 * aplikasi yang keluarannya harus terbaca mesin.
 */

/* -------------------------------------------------------------------------- */
/* Tombol                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm disabled:bg-ink-300",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 shadow-sm disabled:bg-ink-300",
  outline:
    "border border-ink-300 bg-white text-ink-800 hover:bg-ink-50 disabled:text-ink-400",
  ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
  danger: "bg-white text-bad border border-red-200 hover:bg-red-50",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-8 w-8 text-sm",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium",
          "transition-colors disabled:cursor-not-allowed disabled:opacity-70",
          // Area sentuh 44 piksel di perangkat berjari, tanpa mengubah
          // ukuran tombolnya - lihat .tap-target di globals.css.
          "tap-target",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

/* -------------------------------------------------------------------------- */
/* Input dasar                                                                */
/* -------------------------------------------------------------------------- */

const fieldBase =
  "w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 " +
  "placeholder:text-ink-400 transition-colors focus:border-brand-500 " +
  "focus:ring-2 focus:ring-brand-100 focus:outline-none disabled:bg-ink-100";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(fieldBase, "cursor-pointer pr-8", className)}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* Pembungkus field dengan label, petunjuk, dan pesan galat                    */
/* -------------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold tracking-wide text-ink-700"
        >
          {label}
          {required && <span className="ml-0.5 text-bad">*</span>}
        </label>
      )}
      {children}
      {/* Petunjuk pengisian: menjawab "field ini harus diisi apa". */}
      {hint && !error && (
        <p className="text-[11px] leading-relaxed text-ink-500">{hint}</p>
      )}
      {error && <p className="text-[11px] font-medium text-bad">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Kartu, lencana, sakelar                                                    */
/* -------------------------------------------------------------------------- */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "good" | "warn" | "bad" | "brand";
}) {
  const tones = {
    neutral: "bg-ink-100 text-ink-600",
    good: "bg-green-50 text-good",
    warn: "bg-amber-50 text-warn",
    bad: "bg-red-50 text-bad",
    brand: "bg-brand-50 text-brand-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Switch({
  checked,
  onChange,
  label,
  hint,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
  id?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand-600" : "bg-ink-300",
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </button>
      <div className="min-w-0">
        <label
          htmlFor={id}
          onClick={() => onChange(!checked)}
          className="block cursor-pointer text-xs font-semibold text-ink-700"
        >
          {label}
        </label>
        {hint && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Kotak informasi                                                            */
/* -------------------------------------------------------------------------- */

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "bad" | "good";
  title?: string;
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-brand-200 bg-brand-50 text-brand-700",
    warn: "border-amber-200 bg-amber-50 text-warn",
    bad: "border-red-200 bg-red-50 text-bad",
    good: "border-green-200 bg-green-50 text-good",
  };
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2.5 text-xs leading-relaxed",
        tones[tone],
      )}
    >
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      {children}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
