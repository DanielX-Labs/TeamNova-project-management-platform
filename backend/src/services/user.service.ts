import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError";
import MemberModel from "../models/member.model";

export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .populate("currentWorkspace")
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  const membership = user.currentWorkspace
    ? await MemberModel.findOne({
        userId: user._id,
        workspaceId: user.currentWorkspace._id,
      }).populate("role")
    : null;

  return {
    user: {
      ...user.toObject(),
      role: membership?.role?.name || null,
    },
  };
};

export const updateProfileService = async (
  userId: string,
  data: { name: string; address: string; profilePicture: string | null }
) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new BadRequestException("User not found");
  return getCurrentUserService(userId);
};
