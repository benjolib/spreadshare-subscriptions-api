// @flow

import middy from 'middy';
import to from 'await-to-js';
import { jsonBodyParser, validator } from 'middy/middlewares';
import type { PostHandler, Subscription } from '../types';
import httpJsonErrorHandler from '../middlewares/httpJsonErrorHandler';
import { subscriptionSchema } from '../schemas';
import { controller } from './factory';
import { errorRes } from '../utils/http';

const subscribe: PostHandler = async event => {
  const subscription = {
    ...event.pathParameters,
    ...event.body
  };
  const [err, result]: [Error, Subscription] = await to(
    controller.subscribe(subscription)
  );

  if (err != null) {
    console.error(err);
    return errorRes(500, err.message);
  }
  return { statusCode: 200, body: JSON.stringify(result) };
};

export const handler = middy(subscribe)
  .use(jsonBodyParser())
  .use(validator({ inputSchema: subscriptionSchema }))
  .use(httpJsonErrorHandler());
