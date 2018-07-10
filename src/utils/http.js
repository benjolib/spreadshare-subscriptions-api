import type { ErrorResponse } from '../types';

export const errorRes: ErrorResponse = (code: number, msg: string) => ({
  statusCode: code,
  body: {
    errors: [
      {
        status: code,
        detail: msg
      }
    ]
  }
});
