import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50",
    ghost: "hover:bg-neutral-100 hover:text-neutral-900",
    link: "text-neutral-900 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
