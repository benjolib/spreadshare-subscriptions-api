// @flow

import R from 'ramda';
import type { ControllerI, Subscription } from './types';
import type SubscriptionTable from './db/table';

export default class SubController implements ControllerI {
  table: SubscriptionTable;
  constructor(table: SubscriptionTable) {
    this.table = table;
  }

  subscribe(subscription: Subscription): Promise<boolean> {
    const id = `${subscription.userId}:${subscription.publicationId}`;
    return this.table
      .saveOrUpdate(id, subscription)
      .then(res => R.omit(['id', 'createdAt', 'updatedAt'], res));
  }

  getSubscription(
    userId: string,
    publicationId: string
  ): Promise<?Subscription> {
    const id = `${userId}:${publicationId}`;
    return this.table
      .get(id, userId)
      .then(
        res => (res ? R.omit(['id', 'createdAt', 'updatedAt'], res) : undefined)
      );
  }
}
