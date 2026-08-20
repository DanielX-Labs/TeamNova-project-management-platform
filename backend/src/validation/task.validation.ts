import { z } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";

export const titleSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();

export const assignedToSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, { message: "Invalid assignee ID" })
  .nullable()
  .optional();

export const prioritySchema = z.enum(
  Object.values(TaskPriorityEnum) as [string, ...string[]]
);

export const statusSchema = z.enum(
  Object.values(TaskStatusEnum) as [string, ...string[]]
);

export const dueDateSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const taskIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, { message: "Invalid task ID" });

export const createTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

export const updateTaskSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  priority: prioritySchema,
  status: statusSchema,
  assignedTo: assignedToSchema,
  dueDate: dueDateSchema,
});

const optionalObjectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, { message: "Invalid ID" })
  .optional();

const commaSeparatedEnum = <T extends string>(values: readonly T[]) =>
  z
    .string()
    .trim()
    .transform((value) => value.split(",").filter(Boolean))
    .refine(
      (items) => items.length > 0 && items.every((item) => values.includes(item as T)),
      "Invalid filter value"
    )
    .optional();

const commaSeparatedObjectIds = z
  .string()
  .trim()
  .transform((value) => value.split(",").filter(Boolean))
  .refine(
    (items) => items.length > 0 && items.every((item) => /^[a-f\d]{24}$/i.test(item)),
    "Invalid assignee ID"
  )
  .optional();

export const taskFiltersSchema = z.object({
  projectId: optionalObjectId,
  status: commaSeparatedEnum(Object.values(TaskStatusEnum)),
  priority: commaSeparatedEnum(Object.values(TaskPriorityEnum)),
  assignedTo: commaSeparatedObjectIds,
  keyword: z.string().trim().max(100).optional(),
  dueDate: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid due date")
    .optional(),
});
