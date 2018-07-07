// @flow

import R from 'ramda';
import to from 'await-to-js';
import type { DateTimeI, SubscriptionModel, Subscription } from '../types';
import type { DynamoDb } from './types';

export default class SubscriptionTable {
  db: DynamoDb<SubscriptionModel>;
  dateTime: DateTimeI;
  tableName: string;

  constructor(
    tableName: string,
    dynamoDb: DynamoDb<SubscriptionModel>,
    dateTime: DateTimeI
  ) {
    this.tableName = tableName;
    this.db = dynamoDb;
    this.dateTime = dateTime;
  }

  async saveOrUpdate(
    id: string,
    doc: Subscription
  ): Promise<SubscriptionModel> {
    const [err, oldDoc] = await to(this.get(id, doc.userId));

    if (err != null) {
      return Promise.reject(err);
    }

    if (R.isNil(oldDoc)) {
      console.log(`doc ${id} not found, saving new doc`);
      return this._saveDoc(id, doc);
    }
    console.log(`doc ${id} found, updating existing doc`);
    return this._updateDoc(oldDoc, doc);
  }

  get(id: string, userId: string): Promise<?SubscriptionModel> {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
        userId
      }
    };

    return this.db
      .get(params)
      .promise()
      .then(res => res.Item);
  }

  _saveDoc(id: string, doc: Subscription): Promise<any> {
    const timestamp = this.dateTime.getTime();
    const item = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...doc
    };

    const params = {
      TableName: this.tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)'
    };

    return this.db
      .put(params)
      .promise()
      .then(() => item);
  }

  _updateDoc(
    currentDoc: SubscriptionModel,
    newDoc: Subscription
  ): Promise<any> {
    const timestamp = this.dateTime.getTime();
    const item = {
      id: currentDoc.id,
      createdAt: currentDoc.createdAt,
      updatedAt: timestamp,
      ...newDoc
    };

    const params = {
      TableName: this.tableName,
      Item: item
    };

    return this.db
      .put(params)
      .promise()
      .then(() => item);
  }
}
