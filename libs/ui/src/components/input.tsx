import { cn } from "@reactive-resume/utils";
import { forwardRef } from "react";

export type InputProps = {
  hasError?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError = false, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      autoComplete="off"
      className={cn(
        "flex h-9 w-full rounded border border-border bg-transparent px-3 py-0.5 !text-sm ring-0 ring-offset-transparent transition-colors [appearance:textfield] placeholder:opacity-80 hover:bg-secondary/20 focus:border-primary focus:bg-secondary/20 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        type === "file" 
          ? "cursor-pointer file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:hover:bg-primary/90 file:cursor-pointer"
          : "file:border-0 file:bg-transparent file:pt-1 file:text-sm file:font-medium file:text-primary",
        hasError ? "border-error" : "border-border",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
