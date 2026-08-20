import { z } from "zod";

const imageDataUrl = /^data:image\/(jpeg|png|webp|gif);base64,[a-zA-Z0-9+/=]+$/;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(255),
  address: z.string().trim().max(500),
  profilePicture: z
    .string()
    .max(1_500_000, "Profile picture must be smaller than 1 MB")
    .refine(
      (value) => value.startsWith("http://") || value.startsWith("https://") || imageDataUrl.test(value),
      "Profile picture must be a valid image"
    )
    .nullable(),
});
