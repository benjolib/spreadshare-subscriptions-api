// @flow

import R from 'ramda';
import type { ControllerI, Subscription, Channel } from './types';
import type SubscriptionTable from './db/table';

export default class SubController implements ControllerI {
  table: SubscriptionTable;

  constructor(table: SubscriptionTable) {
    this.table = table;
  }

  subscribe(subscription: Subscription): Promise<Subscription> {
    const model = {
      channelId: `${subscription.publicationId}:${subscription.channel}`,
      ...subscription
    };
    return this.table.saveOrUpdate(model).then(R.dissoc('channelId'));
  }

  unsubscribe(
    userId: string,
    publicationId: string,
    channel: Channel
  ): Promise<void> {
    const channelId = `${publicationId}:${channel}`;
    return this.table.delete(userId, channelId);
  }

  getSubscription(
    userId: string,
    publicationId: string,
    channel: Channel
  ): Promise<?Subscription> {
    const channelId = `${publicationId}:${channel}`;
    return this.table
      .get(userId, channelId)
      .then(res => (res ? R.dissoc('channelId', res) : undefined));
  }

  getAllForUser(
    userId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>> {
    return this.table
      .getAllForUser(userId, channel)
      .then(R.map(R.dissoc('channelId')));
  }

  getAllForPublication(
    publicationId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>> {
    return this.table
      .getAllForPublication(publicationId, channel)
      .then(R.map(R.dissoc('channelId')));
  }
}
