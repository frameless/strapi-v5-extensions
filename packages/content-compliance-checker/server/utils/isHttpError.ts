/**
 * Type guard for HTTP errors thrown via `ctx.throw(status, message)`.
 * Preserves intentional HTTP errors (400/404) in the catch block, while unexpected errors are logged and converted to 500.
 */
export const isHttpError = (err: unknown): err is { status: number; message: string } =>
  typeof err === 'object' && err !== null && 'status' in err;
