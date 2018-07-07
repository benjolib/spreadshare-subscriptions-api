export const subscriptionSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['channel', 'frequency'],
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        frequency: {
          type: 'string',
          enum: ['daily', 'weekly', 'monthly']
        },
        channel: {
          type: 'string',
          enum: ['email', 'rss']
        }
      },
      anyOf: [
        {
          not: {
            properties: {
              channel: { enum: ['email'] }
            },
            required: ['channel', 'frequency']
          }
        },
        { required: ['channel', 'frequency', 'email'] }
      ]
    }
  }
};
