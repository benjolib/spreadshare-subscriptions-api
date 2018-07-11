// @flow

import to from 'await-to-js';
import type { Handler } from '../types';
import { controller } from './factory';
import { errorRes } from '../utils/http';

export const handler: Handler = async event => {
  const { userId, publicationId, channel } = event.pathParameters;
  const [err]: [Error] = await to(
    controller.unsubscribe(userId, publicationId, channel)
  );

  if (err != null) {
    console.error(err);
    return errorRes(500, err.message);
  }

  return { statusCode: 200 };
};
