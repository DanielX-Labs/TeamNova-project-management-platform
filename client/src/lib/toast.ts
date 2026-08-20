import { toast as sonner } from "sonner";

type Notification = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const toast = ({ title, description, variant }: Notification) => {
  if (variant === "destructive") return sonner.error(title, { description });
  if (variant === "success") return sonner.success(title, { description });
  return sonner(title, { description });
};
