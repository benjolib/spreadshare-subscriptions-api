// @flow

export interface ControllerI {
  subscribe(subscription: Subscription): Promise<Subscription>;

  unsubscribe(
    userId: string,
    publicationId: string,
    channel: Channel
  ): Promise<void>;

  getSubscription(
    userId: string,
    publicationId: string,
    channel: Channel
  ): Promise<?Subscription>;

  getAllForUser(
    userId: string,
    channel: ?Channel
  ): Promise<Array<Subscription>>;

  getAllForPublication(
    publicationId: string,
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
  +publicationId: string,
  +frequency: Frequency,
  +channel: Channel,
  +createdAt?: number,
  +updatedAt?: number
};

export type SubscriptionDbModel = Subscription & {
  +channelId: string
};

type HttpEvent = {
  pathParameters: {
    +userId: string,
    +publicationId: string,
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

export type Handler = HttpEvent => Promise<HttpResponse>;
