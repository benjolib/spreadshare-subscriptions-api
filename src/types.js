// @flow

export interface ControllerI {
  subscribe(subscription: Subscription): Promise<Subscription>;

  unsubscribe(
    userId: string,
    streamId: string,
    channel: Channel
  ): Promise<void>;

  getSubscription(
    userId: string,
    streamId: string,
    channel: Channel
  ): Promise<?Subscription>;

  getAllForUser(
    userId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>>;

  getAllForStream(
    streamId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>>;
}

export interface DateTimeI {
  getTime(): number;
}

export type Channel = 'email' | 'rss';
export type Frequency = 'daily' | 'weekly' | 'monthly';

export type Subscription = {
  +userId: string,
  +email: string,
  +streamId: string,
  +frequency: Frequency,
  +channel: Channel,
  +createdAt?: number,
  +updatedAt?: number
};

export type SubscriptionDbModel = Subscription & {
  +channelId: string,
  +channelFrequency: string
};

type Event = {
  pathParameters: {
    +userId: string,
    +streamId: string,
    +channel: Channel
  }
};

type PostEvent = {
  pathParameters: {
    +userId: string,
    +streamId: string,
    +channel: Channel
  },
  body: {
    +email: string,
    +frequency: Frequency,
    +channel: Channel
  }
};

type HttpResponse = {
  +statusCode: number,
  +body?: any
};

export type ErrorResponse = {
  +statusCode: number,
  +body: {
    errors: {
      status: number,
      detail: string
    }
  }
};

export type Handler = Event => Promise<HttpResponse>;
export type PostHandler = PostEvent => Promise<HttpResponse>;
