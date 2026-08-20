import mongoose from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import {
  ProviderEnum,
  ProviderEnumType,
} from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (
  data: {
    provider: ProviderEnumType;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
    inviteCode?: string;
  },
  hasRetriedDuplicate = false
): Promise<{ user: UserDocument }> => {
  const { providerId, provider, displayName, email, picture, inviteCode } = data;
  const normalizedEmail = email?.trim().toLowerCase();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingAccount = await AccountModel.findOne({
      provider,
      providerId,
    }).session(session);

    let user = existingAccount
      ? await UserModel.findById(existingAccount.userId).session(session)
      : null;

    if (!user && normalizedEmail) {
      user = await UserModel.findOne({ email: normalizedEmail }).session(session);
    }

    if (!user) {
      if (!normalizedEmail) {
        throw new BadRequestException("Google account did not provide an email");
      }

      // Create a new user if it doesn't exist
      user = new UserModel({
        email: normalizedEmail,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });
    }

    // Link Google to an existing email user on their first Google sign-in.
    if (!existingAccount) {
      await new AccountModel({
        userId: user._id,
        provider,
        providerId,
      }).save({ session });
    } else if (!existingAccount.userId.equals(user._id)) {
      existingAccount.userId = user._id as mongoose.Types.ObjectId;
      await existingAccount.save({ session });
    }

    if (inviteCode) {
      const invitedWorkspace = await WorkspaceModel.findOne({ inviteCode }).session(
        session
      );
      if (!invitedWorkspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
      }

      const memberRole = await RoleModel.findOne({ name: Roles.MEMBER }).session(
        session
      );
      if (!memberRole) throw new NotFoundException("Member role not found");

      const membership = await MemberModel.findOne({
        userId: user._id,
        workspaceId: invitedWorkspace._id,
      }).session(session);

      if (!membership) {
        await new MemberModel({
          userId: user._id,
          workspaceId: invitedWorkspace._id,
          role: memberRole._id,
          joinedAt: new Date(),
        }).save({ session });
      }
      user.currentWorkspace = invitedWorkspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    } else if (!user.currentWorkspace) {
      const existingMembership = await MemberModel.findOne({
        userId: user._id,
      })
        .sort({ joinedAt: 1 })
        .session(session);

      if (existingMembership) {
        user.currentWorkspace = existingMembership.workspaceId;
      } else {
        const ownerRole = await RoleModel.findOne({
          name: Roles.OWNER,
        }).session(session);

        if (!ownerRole) {
          throw new NotFoundException("Owner role not found");
        }

        const workspace = new WorkspaceModel({
          name: "My Workspace",
          description: `Workspace created for ${user.name}`,
          owner: user._id,
        });
        await workspace.save({ session });

        await new MemberModel({
          userId: user._id,
          workspaceId: workspace._id,
          role: ownerRole._id,
          joinedAt: new Date(),
        }).save({ session });

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      }
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();

    return { user };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    const duplicateKey =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    // A repeated OAuth callback can race another callback between the lookup
    // and insert. Retry once so the committed user/account is linked instead.
    if (duplicateKey && !hasRetriedDuplicate) {
      return loginOrCreateAccountService(
        { ...data, email: normalizedEmail },
        true
      );
    }
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
  inviteCode?: string;
}) => {
  const { email, name, password, inviteCode } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    let workspace;
    let membershipRole;

    if (inviteCode) {
      workspace = await WorkspaceModel.findOne({ inviteCode }).session(session);
      membershipRole = await RoleModel.findOne({ name: Roles.MEMBER }).session(
        session
      );
      if (!workspace) {
        throw new NotFoundException("Invalid invite code or workspace not found");
      }
      if (!membershipRole) throw new NotFoundException("Member role not found");
    } else {
      workspace = new WorkspaceModel({
        name: "My Workspace",
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });
      membershipRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
        session
      );
      if (!membershipRole) throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: membershipRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: ProviderEnumType;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
};
