// @flow

import R from 'ramda';
import to from 'await-to-js';
import type { DateTimeI, SubscriptionDbModel, Channel } from '../types';
import type { DynamoDb } from './types';

export default class SubscriptionTable {
  db: DynamoDb<SubscriptionDbModel>;

  dateTime: DateTimeI;

  tableName: string;

  constructor(
    tableName: string,
    dynamoDb: DynamoDb<SubscriptionDbModel>,
    dateTime: DateTimeI
  ) {
    this.tableName = tableName;
    this.db = dynamoDb;
    this.dateTime = dateTime;
  }

  async saveOrUpdate(doc: SubscriptionDbModel): Promise<SubscriptionDbModel> {
    const [err, oldDoc]: [Error, SubscriptionDbModel] = await to(
      this.get(doc.userId, doc.channelId)
    );

    if (err != null) {
      return Promise.reject(err);
    }

    if (R.isNil(oldDoc)) {
      logSaving(doc);
      return this._saveDoc(doc);
    }
    logUpdating(doc);
    return this._updateDoc(oldDoc, doc);
  }

  get(userId: string, channelId: string): Promise<?SubscriptionDbModel> {
    const params = {
      TableName: this.tableName,
      Key: {
        userId,
        channelId
      }
    };

    return this.db
      .get(params)
      .promise()
      .then(R.prop('Item'));
  }

  delete(userId: string, channelId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        userId,
        channelId
      }
    };

    return this.db.delete(params).promise();
  }

  getAllForUser(
    userId: string,
    channel: ?Channel
  ): Promise<Array<SubscriptionDbModel>> {
    let condition = 'userId = :userId';
    let expression = {
      ':userId': userId
    };
    let indexName = null;

    if (!R.isNil(channel)) {
      condition = 'userId = :userId AND channel = :channel';
      expression = {
        ':userId': userId,
        ':channel': channel
      };
      indexName = 'user-channel-index';
    }

    const params = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: condition,
      ExpressionAttributeValues: expression
    };

    return this.db
      .query(params)
      .promise()
      .then(res => res.Items);
  }

  getAllForPublication(
    publicationId: string,
    channel: ?Channel
  ): Promise<Array<SubscriptionDbModel>> {
    let condition = 'publicationId = :publicationId';
    let expression = {
      ':publicationId': publicationId
    };

    if (!R.isNil(channel)) {
      condition = 'publicationId = :publicationId AND channel = :channel';
      expression = {
        ':publicationId': publicationId,
        ':channel': channel
      };
    }

    const params = {
      TableName: this.tableName,
      IndexName: 'publication-channel-index',
      KeyConditionExpression: condition,
      ExpressionAttributeValues: expression
    };

    return this.db
      .query(params)
      .promise()
      .then(res => res.Items);
  }

  _saveDoc(doc: SubscriptionDbModel): Promise<SubscriptionDbModel> {
    const timestamp = this.dateTime.getTime();
    const item = {
      ...doc,
      createdAt: timestamp,
      updatedAt: timestamp
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
    currentDoc: SubscriptionDbModel,
    newDoc: SubscriptionDbModel
  ): Promise<SubscriptionDbModel> {
    const timestamp = this.dateTime.getTime();
    const item = {
      ...newDoc,
      createdAt: currentDoc.createdAt,
      updatedAt: timestamp
    };

    const params = {
      TableName: this.tableName,
      Item: item
    };

    return this.db
      .put(params)
      .promise()
      .then(() => params.Item);
  }
}

const logSaving = (doc: SubscriptionDbModel) => {
  console.log(
    `doc for user:${doc.userId}, pub:${doc.publicationId} and channel:${
      doc.channel
    } not found, saving new doc`
  );
};

const logUpdating = (doc: SubscriptionDbModel) => {
  console.log(
    `doc for user:${doc.userId}, pub:${doc.publicationId} and channel:${
      doc.channel
    } found, updating`
  );
};
