import sinon from 'sinon';
import SubscriptionTable from './table';

describe('subscriptionTableTest', () => {
  const tableName = 'subscriptions';
  const userOneId = '125';
  const userTwoId = '126';
  const channelOneId = 'abc:email';

  const subOne = {
    userId: userOneId,
    streamId: 'abc',
    channel: 'email',
    channelId: 'abc:email',
    email: 'some@email.com',
    frequency: 'monthly',
    updatedAt: 1531045707855,
    createdAt: 1531045707855
  };
  const subTwo = {
    userId: userOneId,
    streamId: 'xyz',
    channel: 'rss',
    channelId: 'xyz:rss',
    frequency: 'weekly',
    updatedAt: 1531045709233,
    createdAt: 1531045707857
  };

  const subThree = {
    userId: userTwoId,
    streamId: 'xyz',
    channel: 'email',
    channelId: 'xyz:email',
    frequency: 'daily',
    updatedAt: 1531045707955,
    createdAt: 1531045707859
  };

  const params = {
    TableName: tableName,
    Key: {
      userId: userOneId,
      channelId: channelOneId
    }
  };

  let db = null;

  beforeEach(() => {
    db = {
      get: () => {},
      delete: () => {},
      put: () => {},
      query: () => {}
    };
  });

  it('should get the document for given id', async () => {
    // setup
    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({
      Item: subOne
    });

    // expectation
    mockDb
      .expects('get')
      .withArgs(params)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    const result = await table.get('125', 'abc:email');

    // assertion
    expect(result).toEqual(subOne);
  });

  it('should delete the document for given id', async () => {
    // setup
    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({});

    // expectation
    mockDb
      .expects('delete')
      .withArgs(params)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    await table.delete('125', 'abc:email');
  });

  it('should save the document if document does not exist', async () => {
    // setup
    const putObj = {
      ...subOne,
      createdAt: 12345,
      updatedAt: 12345
    };
    const putParams = {
      TableName: tableName,
      Item: putObj,
      ConditionExpression: 'attribute_not_exists(id)'
    };

    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({});

    // expectation
    mockDb
      .expects('get')
      .withArgs(params)
      .returns({
        promise: promiseStub
      });

    mockDb
      .expects('put')
      .withArgs(putParams)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {
      getTime: () => 12345
    });
    const result = await table.saveOrUpdate(subOne);
    expect(result).toEqual(putObj);
  });

  it('should update the document if document does not exist', async () => {
    // setup
    const putObj = {
      ...subOne,
      createdAt: subOne.createdAt,
      updatedAt: 12345
    };
    const putParams = {
      TableName: tableName,
      Item: putObj
    };

    const mockDb = sinon.mock(db);
    const getPromiseStub = sinon.stub().resolves({
      Item: subOne
    });
    const putPromiseStub = sinon.stub().resolves({});

    // expectation
    mockDb
      .expects('get')
      .withArgs(params)
      .returns({
        promise: getPromiseStub
      });

    mockDb
      .expects('put')
      .withArgs(putParams)
      .returns({
        promise: putPromiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {
      getTime: () => 12345
    });
    const result = await table.saveOrUpdate(subOne);
    expect(result).toEqual(putObj);
  });

  it('saveOrUpdate should fail if getting doc throws error', async () => {
    // setup
    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().rejects(new Error());

    // expectation
    mockDb
      .expects('get')
      .withArgs(params)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    await expect(table.saveOrUpdate(subOne)).rejects.toEqual(new Error());
  });

  it('should get all subscriptions for user', async () => {
    const expectedResult = [subOne, subTwo];
    const queryParams = {
      TableName: tableName,
      IndexName: null,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userOneId
      }
    };

    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({
      Items: expectedResult
    });
    // expectation
    mockDb
      .expects('query')
      .withArgs(queryParams)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    const result = await table.getAllForUser(userOneId);
    expect(result).toEqual(expectedResult);
  });

  it('should get all subscriptions for user for a given channel', async () => {
    const expectedResult = [subOne];
    const queryParams = {
      TableName: tableName,
      IndexName: 'user-channel-index',
      KeyConditionExpression: 'userId = :userId AND channel = :channel',
      ExpressionAttributeValues: {
        ':userId': userOneId,
        ':channel': 'email'
      }
    };

    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({
      Items: expectedResult
    });
    // expectation
    mockDb
      .expects('query')
      .withArgs(queryParams)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    const result = await table.getAllForUser(userOneId, 'email');
    expect(result).toEqual(expectedResult);
  });

  it('should get all subscriptions for publication', async () => {
    const expectedResult = [subTwo, subThree];
    const queryParams = {
      TableName: tableName,
      IndexName: 'publication-channel-index',
      KeyConditionExpression: 'streamId = :streamId',
      ExpressionAttributeValues: {
        ':streamId': 'xyz'
      }
    };

    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({
      Items: expectedResult
    });
    // expectation
    mockDb
      .expects('query')
      .withArgs(queryParams)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    const result = await table.getAllForPublication('xyz');
    expect(result).toEqual(expectedResult);
  });

  it('should get all subscriptions for publication for a given channel', async () => {
    const expectedResult = [subTwo];
    const queryParams = {
      TableName: tableName,
      IndexName: 'publication-channel-index',
      KeyConditionExpression: 'streamId = :streamId AND channel = :channel',
      ExpressionAttributeValues: {
        ':streamId': 'xyz',
        ':channel': 'rss'
      }
    };

    const mockDb = sinon.mock(db);
    const promiseStub = sinon.stub().resolves({
      Items: expectedResult
    });
    // expectation
    mockDb
      .expects('query')
      .withArgs(queryParams)
      .returns({
        promise: promiseStub
      });

    // call
    const table = new SubscriptionTable(tableName, db, {});
    const result = await table.getAllForPublication('xyz', 'rss');
    expect(result).toEqual(expectedResult);
  });
});
