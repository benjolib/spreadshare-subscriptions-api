// @flow

import to from 'await-to-js';
import type { Handler, Subscription } from '../types';
import { controller } from './factory';
import { errorRes } from '../utils/http';

export const handler: Handler = async event => {
  const { userId, streamId, channel } = event.pathParameters;
  const [err, result]: [Error, Subscription] = await to(
    controller.getSubscription(userId, streamId, channel)
  );

  if (err != null) {
    console.error(err);
    return errorRes(500, err.message);
  }

  return result
    ? { statusCode: 200, body: JSON.stringify(result) }
    : { statusCode: 404 };
};
