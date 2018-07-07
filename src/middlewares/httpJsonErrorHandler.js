import { HttpError } from 'http-errors';

const mw = () => ({
  onError: (handler, next) => {
    console.log('>>>>>>>>>onError >>>>>>>>>>');
    if (handler.error instanceof HttpError) {
      // as per JSON spec http://jsonapi.org/examples/#error-objects-basics
      handler.response = {
        body: JSON.stringify({
          errors: [
            {
              status: handler.error.statusCode,
              message: handler.error.message,
              detail: handler.error.details
            }
          ]
        })
      };
      return next();
    }
    return next(handler.error);
  }
});

export default mw;
