// @flow

export interface ControllerI {
  subscribe(subscription: Subscription): Promise<boolean>;
  getSubscription(
    userId: string,
    publicationId: string
  ): Promise<?Subscription>;
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
  +channel: Channel
};

export type SubscriptionModel = Subscription & {
  +id: string,
  +createdAt: number,
  +updatedAt: number
};

type HttpEvent = {
  pathParameters: {
    +userId: string,
    +publicationId: string
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
