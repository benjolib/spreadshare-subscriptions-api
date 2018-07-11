// @flow

import AWS from 'aws-sdk';
import SubscriptionTable from '../db/table';
import Controller from '../controller';
import dateTime from '../utils/dateTime';

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  };
}
const tableName = process.env.TABLE_NAME || 'spreadshare-subscriptions-dev';

const dynamoClient = new AWS.DynamoDB.DocumentClient(options);
const db = new SubscriptionTable(tableName, dynamoClient, dateTime);

export const controller = new Controller(db);
