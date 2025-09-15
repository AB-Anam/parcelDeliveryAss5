export const allowedRoles = ["admin", "sender", "receiver"] as const;
export type RoleType = typeof allowedRoles[number]; // "admin" | "sender" | "receiver"