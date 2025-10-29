// lambda/producer.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { randomUUID } from 'crypto';

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});

const TABLE_NAME = process.env.TABLE_NAME!;
const TOPIC_ARN = process.env.TOPIC_ARN!;

export const handler = async (event: any) => {
  console.log('Event:', JSON.stringify(event));
  // 1. 解析請求 Body
  const body = JSON.parse(event.body || '{}');
  const { name, email } = body;

  // 2. 驗證必填欄位
  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 'ERR_VALIDATION',
        message: 'name 與 email 為必填欄位'
      })
    };
  }

  // 3. 準備並寫入 DynamoDB
  const studentId = randomUUID();
  const item = {
      PK: `STUDENT#${studentId}`,
      SK: `PROFILE#${studentId}`,
      Id: studentId,
      name: name,
      email: email,
  };

  await ddbDocClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));

  // 4. 發送 SNS 事件
  const payload = {
    ...item,
    time: new Date().toISOString()
  };

  await sns.send(new PublishCommand({
    TopicArn: TOPIC_ARN,
    Message: JSON.stringify(payload)
  }));

  // 5. 回傳成功回應
  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Student created successfully',
      payload
    })
  };
};
