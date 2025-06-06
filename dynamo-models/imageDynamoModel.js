require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const params = {
  TableName: 'RealReview',
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'SK', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

const run = async () => {
  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('✅ Table created:', data);
  } catch (err) {
    console.error('❌ Error creating table:', err);
  }
};

run();
