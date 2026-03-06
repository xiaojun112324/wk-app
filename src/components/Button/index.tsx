import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        solid: "shadow-xs",
        outline: "border bg-transparent shadow-xs",
        ghost: "bg-transparent shadow-none",
        link: "!p-0 !h-auto underline-offset-4 hover:underline bg-transparent shadow-none",
        secondary: "shadow-xs",
      },
      color: {
        default: "",
        destructive: "",
        warning: "",
        error: "",
        success: "",
        info: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-sm",
        xs: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-sm",
        icon: "size-9",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      color: "default",
      size: "default",
      full: false,
    },
    compoundVariants: [
      // solid
      {
        variant: "solid",
        color: "default",
        class: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30",
      },
      {
        variant: "solid",
        color: "destructive",
        class: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
      },
      {
        variant: "solid",
        color: "warning",
        class: "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-300",
      },
      {
        variant: "solid",
        color: "error",
        class: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300",
      },
      {
        variant: "solid",
        color: "success",
        class: "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-300",
      },
      {
        variant: "solid",
        color: "info",
        class: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-300",
      },

      // secondary
      {
        variant: "secondary",
        color: "default",
        class: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/30",
      },
      {
        variant: "secondary",
        color: "destructive",
        class: "bg-destructive/20 text-destructive hover:bg-destructive/30 focus-visible:ring-destructive/20",
      },
      {
        variant: "secondary",
        color: "warning",
        class: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 focus-visible:ring-yellow-200",
      },
      {
        variant: "secondary",
        color: "error",
        class: "bg-red-100 text-red-600 hover:bg-red-200 focus-visible:ring-red-200",
      },
      {
        variant: "secondary",
        color: "success",
        class: "bg-green-100 text-green-600 hover:bg-green-200 focus-visible:ring-green-200",
      },
      {
        variant: "secondary",
        color: "info",
        class: "bg-blue-100 text-blue-600 hover:bg-blue-200 focus-visible:ring-blue-200",
      },
    ],
  }
)

function Button({
  className,
  variant,
  color,
  size,
  full,
  asChild = false,
  loading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    full?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, color, size, full }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <div className="relative w-4 h-4">
          <Loader2Icon className="animate-spin absolute top-1/2 left-1/2 -translate-1/2" />
        </div>
      )}
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
