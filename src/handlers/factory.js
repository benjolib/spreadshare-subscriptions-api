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

const dynamoClient = new AWS.DynamoDB.DocumentClient(options);
const db = new SubscriptionTable(
  'spreadshare-subscriptions-dev',
  dynamoClient,
  dateTime
);

export const controller = new Controller(db);
