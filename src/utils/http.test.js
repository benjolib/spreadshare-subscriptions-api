import { errorRes } from './http';

describe('errorRes', () => {
  it('should return proper error response', () => {
    expect(errorRes(404, 'not found')).toEqual({
      body: { errors: [{ detail: 'not found', status: 404 }] },
      statusCode: 404
    });
  });
});
