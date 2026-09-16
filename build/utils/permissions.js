export const canModifyPost = (userId, role, creatorId, allowedRoles) => {
    const isOwner = creatorId === userId;
    const hasRole = allowedRoles.includes(role);
    return isOwner || hasRole;
};
//# sourceMappingURL=permissions.js.map