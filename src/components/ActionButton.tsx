import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const actionButtonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "text-primary-foreground shadow-[0_10px_30px_-12px_var(--primary)] hover:brightness-110 [background-image:var(--gradient-cta)]",
        accent:
          "text-accent-foreground shadow-[0_10px_30px_-12px_var(--saffron)] hover:brightness-110 [background-image:var(--gradient-accent)]",
        ghost: "border border-border bg-transparent text-foreground hover:bg-secondary",
        quiet: "text-muted-foreground hover:text-foreground",
      },
      size: {
        md: "min-h-11",
        lg: "min-h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof actionButtonVariants>;

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(actionButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
ActionButton.displayName = "ActionButton";
