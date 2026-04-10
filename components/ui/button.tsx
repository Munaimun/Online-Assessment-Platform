import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600",
        secondary: "bg-zinc-100 px-4 py-2 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-400",
        ghost: "px-3 py-2 text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-400",
        danger: "bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus-visible:ring-red-600",
      },
      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
