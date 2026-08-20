import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";
import { RoleType } from "../enums/role.enum";

export const ensureRoles = async () => {
  await Promise.all(
    (Object.keys(RolePermissions) as RoleType[]).map((name) =>
      RoleModel.updateOne(
        { name },
        {
          $set: { permissions: RolePermissions[name] },
          $setOnInsert: { name },
        },
        { upsert: true }
      )
    )
  );
};
