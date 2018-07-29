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
      channelFrequency: `${subscription.channel}:${subscription.frequency}`,
      channelId: `${subscription.streamId}:${subscription.channel}`,
      ...subscription
    };
    // $FlowIgnore
    return this.table
      .saveOrUpdate(model)
      .then(R.omit(['channelId', 'channelFrequency']));
  }

  unsubscribe(
    userId: string,
    streamId: string,
    channel: Channel
  ): Promise<void> {
    const channelId = `${streamId}:${channel}`;
    return this.table.delete(userId, channelId);
  }

  getSubscription(
    userId: string,
    streamId: string,
    channel: Channel
  ): Promise<?Subscription> {
    const channelId = `${streamId}:${channel}`;
    return this.table.get(userId, channelId).then(
      // $FlowIgnore
      res => (res ? R.omit(['channelId', 'channelFrequency'], res) : undefined)
    );
  }

  getAllForUser(
    userId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>> {
    return (
      this.table
        .getAllForUser(userId, channel)
        // $FlowIgnore
        .then(R.map(R.omit(['channelId', 'channelFrequency'])))
    );
  }

  getAllForStream(
    streamId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>> {
    return (
      this.table
        .getAllForStream(streamId, channel)
        // $FlowIgnore
        .then(R.map(R.omit(['channelId', 'channelFrequency'])))
    );
  }
}
