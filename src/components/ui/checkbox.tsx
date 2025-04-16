/** @format */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define variants for the Checkbox component
const checkboxVariants = cva(
    "relative inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 text-neutral-50 border border-neutral-900 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:border-neutral-50 dark:hover:bg-neutral-50/90",
                outline:
                    "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
                destructive:
                    "bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
                ghost:
                    "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
            },
            size: {
                default: "h-5 w-5",
                sm: "h-4 w-4",
                lg: "h-6 w-6",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, // Omit the conflicting `size` property
    VariantProps<typeof checkboxVariants> {
    asChild?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "input";
        return (
            <Comp
                type="checkbox"
                className={cn(checkboxVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
