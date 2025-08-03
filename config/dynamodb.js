require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SDK for DynamoDB
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Export DynamoDB client and table name
module.exports = {
  dynamoDB,
  TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
};
