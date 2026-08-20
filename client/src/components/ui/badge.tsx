import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        [TaskStatusEnum.BACKLOG]: "border-slate-200 bg-slate-100 text-slate-600",
        [TaskStatusEnum.TODO]: "border-blue-200 bg-blue-50 text-blue-700",
        [TaskStatusEnum.IN_PROGRESS]: "border-blue-200 bg-blue-100 text-[#3B82F6]",
        [TaskStatusEnum.IN_REVIEW]: "border-violet-200 bg-violet-100 text-[#8B5CF6]",
        [TaskStatusEnum.DONE]: "border-emerald-200 bg-emerald-100 text-[#10B981]",
        [TaskPriorityEnum.HIGH]: "border-red-200 bg-red-100 text-[#EF4444]",
        [TaskPriorityEnum.MEDIUM]: "border-amber-200 bg-amber-100 text-[#F59E0B]",
        [TaskPriorityEnum.LOW]: "border-slate-200 bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
