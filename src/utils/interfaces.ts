export interface HttpError extends Error {
  statusCode?: number;
  data?: any;
}

export type UserRole = "user" | "editor" | "admin";
