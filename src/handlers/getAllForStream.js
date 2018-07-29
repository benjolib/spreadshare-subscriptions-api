// @flow

import R from 'ramda';
import to from 'await-to-js';
import type { Handler, Subscription } from '../types';
import { controller } from './factory';
import { errorRes } from '../utils/http';

export const handler: Handler = async event => {
  const { streamId } = event.pathParameters;
  const channelPref = R.path(['queryStringParameters', 'channel'], event);
  const [err, result]: [Error, Array<Subscription>] = await to(
    controller.getAllForStream(streamId, channelPref)
  );

  if (err != null) {
    console.error(err);
    return errorRes(500, err.message);
  }
  return result.length !== 0
    ? { statusCode: 200, body: JSON.stringify(result) }
    : { statusCode: 404 };
};
