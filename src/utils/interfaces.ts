export interface HttpError extends Error {
  statusCode?: number;
  data?: any;
}
