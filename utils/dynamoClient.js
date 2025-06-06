require('dotenv').config();
const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  DeleteItemCommand,
  ScanCommand
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Create or update an item
const putItem = async (item) => {
  const params = {
    TableName: 'RealReview',
    Item: marshall(item)
  };

  try {
    await client.send(new PutItemCommand(params));
    return true;
  } catch (error) {
    console.error('Error putting item into DynamoDB', error);
    throw error;
  }
};

// Get a single item by PK and SK
const getItem = async (pk, sk) => {
  const params = {
    TableName: 'RealReview',
    Key: marshall({
      PK: pk,
      SK: sk
    })
  };

  try {
    const { Item } = await client.send(new GetItemCommand(params));
    return Item ? unmarshall(Item) : null;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
    throw error;
  }
};

// Query items by partition key
const queryItems = async (pk, options = {}) => {
  const params = {
    TableName: 'RealReview',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: marshall({
      ':pk': pk
    })
  };

  if (options.skBeginsWith) {
    params.KeyConditionExpression += ' AND begins_with(SK, :skPrefix)';
    params.ExpressionAttributeValues = marshall({
      ':pk': pk,
      ':skPrefix': options.skBeginsWith
    });
  }

  try {
    const { Items } = await client.send(new QueryCommand(params));
    return Items ? Items.map(item => unmarshall(item)) : [];
  } catch (error) {
    console.error('Error querying items from DynamoDB', error);
    throw error;
  }
};

// Delete an item
const deleteItem = async (pk, sk) => {
  const params = {
    TableName: 'RealReview',
    Key: marshall({
      PK: pk,
      SK: sk
    })
  };

  try {
    await client.send(new DeleteItemCommand(params));
    return true;
  } catch (error) {
    console.error('Error deleting item from DynamoDB', error);
    throw error;
  }
};

// Scan items with filter
const scanItems = async (filterExpression = null, expressionAttributeValues = null) => {
  const params = {
    TableName: 'RealReview'
  };

  if (filterExpression) {
    params.FilterExpression = filterExpression;
    if (expressionAttributeValues) {
      params.ExpressionAttributeValues = marshall(expressionAttributeValues);
    }
  }

  try {
    const { Items } = await client.send(new ScanCommand(params));
    return Items ? Items.map(item => unmarshall(item)) : [];
  } catch (error) {
    console.error('Error scanning items from DynamoDB', error);
    throw error;
  }
};

module.exports = {
  client,
  putItem,
  getItem,
  queryItems,
  deleteItem,
  scanItems
};
