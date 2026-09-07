export const canModifyPost = (
  userId: string,
  role: string,
  creatorId: string,
  allowedRoles: string[],
) => {
  const isOwner = creatorId === userId;
  const hasRole = allowedRoles.includes(role);
  return isOwner || hasRole;
};
