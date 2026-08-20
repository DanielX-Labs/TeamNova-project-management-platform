import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService, updateProfileService } from "../services/user.service";
import { updateProfileSchema } from "../validation/user.validation";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);

export const updateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);
    const { user } = await updateProfileService(req.user?._id, data);

    return res.status(HTTPSTATUS.OK).json({
      message: "Profile updated successfully",
      user,
    });
  }
);
