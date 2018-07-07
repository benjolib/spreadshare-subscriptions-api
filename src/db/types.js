type DbParams = {
  TableName: string,
  Key: any
};

type DbDoc<T> = {
  Item: ?T
};

type DbDocPromise<T> = {
  promise: () => Promise<DbDoc<T>>
};

export interface DynamoDb<T> {
  get(params: DbParams): DbDocPromise<T>;
}
