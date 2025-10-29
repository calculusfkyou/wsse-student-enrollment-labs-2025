// lib/wsse-w8-iac-stack.ts (CloudShell 適用版本)

import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// 注意：我們不再需要 NodejsFunction
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as eventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as path from 'path';

export class WsseW8IacStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. 建立 DynamoDB 資料表
    const table = new dynamodb.Table(this, 'Students', {
      tableName: 'StudentsCDK',
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // 2. 建立 SNS Topic
    const topic = new sns.Topic(this, 'StudentTopic', {
      topicName: 'studentEvents-topic'
    });

    // 3. 建立 SQS Queue
    const queue = new sqs.Queue(this, 'StudentQueue', {
      queueName: 'studentEvents-queue'
    });

    // 4. 建立 SNS 到 SQS 的訂閱關係
    topic.addSubscription(new subs.SqsSubscription(queue));

    // 5. 建立 Producer Lambda (使用 lambda.Function)
    const producer = new lambda.Function(this, 'StudentsProducer', {
      functionName: 'StudentsProducer',
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'producer.handler',
      environment: {
        TABLE_NAME: table.tableName,
        TOPIC_ARN: topic.topicArn
      }
    });

    // 6. 建立 Consumer Lambda (使用 lambda.Function)
    const consumer = new lambda.Function(this, 'StudentConsumer', {
      functionName: 'StudentConsumer',
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
      handler: 'consumer.handler',
    });

    // 7. 設定 SQS 作為 Consumer Lambda 的事件來源
    consumer.addEventSource(new eventSources.SqsEventSource(queue, {
      batchSize: 10
    }));

    // 8. 授予 Producer Lambda 最小權限
    table.grantReadWriteData(producer);
    topic.grantPublish(producer);

    // 9. 授予 Consumer Lambda 最小權限
    queue.grantConsumeMessages(consumer);
  }
}
