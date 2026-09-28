export const TABLE = {
  NAME_ENV_KEY: 'DYNAMODB_TABLE_NAME',
  GSI1: 'GSI1',
  GSI2: 'GSI2',
} as const;

export const KEY_PREFIXES = {
  USER: 'USER#',
  PRODUCT: 'PRODUCT#',
  CATEGORY: 'CATEGORY#',
  EMAIL: 'EMAIL#',
  CART: 'CART#',
  ORDER: 'ORDER#',
} as const;

export const SK_VALUES = {
  PROFILE: 'PROFILE',
  METADATA: 'METADATA',
  USER: 'USER',
} as const;
