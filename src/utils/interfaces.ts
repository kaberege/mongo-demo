export interface HttpError extends Error {
  statusCode?: number;
  data?: any;
}

export interface DecodedToken {
  userId: string;
  role: UserRole;
}

export type UserRole = "user" | "editor" | "admin";
