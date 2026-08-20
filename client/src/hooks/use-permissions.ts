import { UserType, WorkspaceWithMembersType } from "@/types/api.type";
import { useMemo } from "react";

const usePermissions = (
  user: UserType | undefined,
  workspace: WorkspaceWithMembersType | undefined
) => {
  return useMemo(() => {
    if (!user || !workspace) return [];
    const member = workspace.members.find(
      (workspaceMember) => workspaceMember.userId === user._id
    );
    return member?.role.permissions || [];
  }, [user, workspace]);
};

export default usePermissions;
