export const errorRes = (code: number, msg: string) => ({
  statusCode: code,
  body: {
    errors: [
      {
        status: code,
        message: msg
      }
    ]
  }
});
