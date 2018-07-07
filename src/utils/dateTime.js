// @flow

import type { DateTimeI } from '../types';

const dateTime: DateTimeI = {
  getTime: () => new Date().getTime()
};

export default dateTime;
