import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { env } from '../config/env';

const baseClient = new DynamoDBClient({
  region: env.AWS_REGION,
  endpoint: env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const dynamoClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const TABLE_NAME = env.DYNAMODB_TABLE_NAME;
