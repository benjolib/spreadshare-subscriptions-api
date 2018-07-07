// @flow

import R from 'ramda';
import to from 'await-to-js';
import type { Handler } from '../types';
import { controller } from './factory';

export const handler: Handler = async event => {
  const { userId, publicationId } = event.pathParameters;
  const [err, result] = await to(
    controller.getSubscription(userId, publicationId)
  );

  if (err != null) {
    console.log(err);
    return { statusCode: 500, body: serverError(err.message) };
  }

  return result ? { statusCode: 200, body: result } : { statusCode: 404 };
};

const serverError = (msg: string) => ({
  errors: [
    {
      status: 500,
      message: msg
    }
  ]
});
