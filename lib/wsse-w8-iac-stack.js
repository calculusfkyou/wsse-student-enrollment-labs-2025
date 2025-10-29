"use strict";
// lib/wsse-w8-iac-stack.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsseW8IacStack = void 0;
// 匯入所有需要的模組 (Slide 19)
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const sns = __importStar(require("aws-cdk-lib/aws-sns"));
const sqs = __importStar(require("aws-cdk-lib/aws-sqs"));
const subs = __importStar(require("aws-cdk-lib/aws-sns-subscriptions"));
const eventSources = __importStar(require("aws-cdk-lib/aws-lambda-event-sources"));
const path = __importStar(require("path"));
class WsseW8IacStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // 1. 建立 DynamoDB 資料表 (Slide 21)
        const table = new dynamodb.Table(this, 'Students', {
            tableName: 'Students', // 明確指定資料表名稱
            partitionKey: {
                name: 'PK',
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: 'SK',
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            // 在教學和開發環境中，摧毀 Stack 時一併刪除資料表
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        // 2. 建立 SNS Topic (Slide 22)
        const topic = new sns.Topic(this, 'StudentTopic', {
            topicName: 'studentEvents-topic'
        });
        // 3. 建立 SQS Queue (Slide 22)
        const queue = new sqs.Queue(this, 'StudentQueue', {
            queueName: 'studentEvents-queue'
        });
        // 4. 建立 SNS 到 SQS 的訂閱關係 (Slide 22)
        topic.addSubscription(new subs.SqsSubscription(queue));
        // 5. 建立 Producer Lambda (處理 API 請求) (Slide 23)
        const producer = new aws_lambda_nodejs_1.NodejsFunction(this, 'StudentsProducer', {
            functionName: 'StudentsProducer', // 明確指定函式名稱
            entry: path.join(__dirname, '../lambda/producer.ts'), // Lambda 程式碼路徑
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                TABLE_NAME: table.tableName,
                TOPIC_ARN: topic.topicArn
            }
        });
        // 6. 建立 Consumer Lambda (處理背景任務) (Slide 24)
        const consumer = new aws_lambda_nodejs_1.NodejsFunction(this, 'StudentConsumer', {
            functionName: 'StudentConsumer', // 明確指定函式名稱
            entry: path.join(__dirname, '../lambda/consumer.ts'),
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_18_X,
        });
        // 7. 設定 SQS 作為 Consumer Lambda 的事件來源 (Slide 24)
        consumer.addEventSource(new eventSources.SqsEventSource(queue, {
            batchSize: 10
        }));
        // 8. 授予 Producer Lambda 最小權限 (Slide 25)
        table.grantReadWriteData(producer); // 授予對 DynamoDB 的讀寫權限
        topic.grantPublish(producer); // 授予對 SNS 的發布權限
        // 9. 授予 Consumer Lambda 最小權限 (Slide 25)
        queue.grantConsumeMessages(consumer); // 授予對 SQS 的讀取/刪除訊息權限
    }
}
exports.WsseW8IacStack = WsseW8IacStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3NzZS13OC1pYWMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3c3NlLXc4LWlhYy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQTJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzQix1QkFBdUI7QUFDdkIsNkNBQXlFO0FBRXpFLG1FQUFxRDtBQUNyRCwrREFBaUQ7QUFDakQscUVBQStEO0FBQy9ELHlEQUEyQztBQUMzQyx5REFBMkM7QUFDM0Msd0VBQTBEO0FBQzFELG1GQUFxRTtBQUNyRSwyQ0FBNkI7QUFFN0IsTUFBYSxjQUFlLFNBQVEsbUJBQUs7SUFDdkMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixnQ0FBZ0M7UUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZO1lBQ25DLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ3BDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU07YUFDcEM7WUFDRCxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2pELDhCQUE4QjtZQUM5QixhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO1NBQ3JDLENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNoRCxTQUFTLEVBQUUscUJBQXFCO1NBQ2pDLENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNoRCxTQUFTLEVBQUUscUJBQXFCO1NBQ2pDLENBQUMsQ0FBQztRQUVILG1DQUFtQztRQUNuQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXZELCtDQUErQztRQUMvQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzVELFlBQVksRUFBRSxrQkFBa0IsRUFBRSxXQUFXO1lBQzdDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx1QkFBdUIsQ0FBQyxFQUFFLGVBQWU7WUFDckUsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTO2dCQUMzQixTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVE7YUFDMUI7U0FDRixDQUFDLENBQUM7UUFFSCw0Q0FBNEM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUMzRCxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsV0FBVztZQUM1QyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUM7WUFDcEQsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztTQUNwQyxDQUFDLENBQUM7UUFFSCxnREFBZ0Q7UUFDaEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO1lBQzdELFNBQVMsRUFBRSxFQUFFO1NBQ2QsQ0FBQyxDQUFDLENBQUM7UUFFSix3Q0FBd0M7UUFDeEMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUJBQXFCO1FBQ3pELEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBTyxnQkFBZ0I7UUFFcEQsd0NBQXdDO1FBQ3hDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtJQUM3RCxDQUFDO0NBQ0Y7QUFqRUQsd0NBaUVDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3dzc2UtdzgtaWFjLXN0YWNrLnRzXG5cbi8vIOWMr+WFpeaJgOaciemcgOimgeeahOaooee1hCAoU2xpZGUgMTkpXG5pbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcywgRHVyYXRpb24sIFJlbW92YWxQb2xpY3kgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBOb2RlanNGdW5jdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIGV2ZW50U291cmNlcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLWV2ZW50LXNvdXJjZXMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGNsYXNzIFdzc2VXOElhY1N0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIDEuIOW7uueriyBEeW5hbW9EQiDos4fmlpnooaggKFNsaWRlIDIxKVxuICAgIGNvbnN0IHRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdTdHVkZW50cycsIHtcbiAgICAgIHRhYmxlTmFtZTogJ1N0dWRlbnRzJywgLy8g5piO56K65oyH5a6a6LOH5paZ6KGo5ZCN56ixXG4gICAgICBwYXJ0aXRpb25LZXk6IHtcbiAgICAgICAgbmFtZTogJ1BLJyxcbiAgICAgICAgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkdcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiB7XG4gICAgICAgIG5hbWU6ICdTSycsXG4gICAgICAgIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HXG4gICAgICB9LFxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcbiAgICAgIC8vIOWcqOaVmeWtuOWSjOmWi+eZvOeSsOWig+S4re+8jOaRp+avgCBTdGFjayDmmYLkuIDkvbXliKrpmaTos4fmlpnooahcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSwgXG4gICAgfSk7XG5cbiAgICAvLyAyLiDlu7rnq4sgU05TIFRvcGljIChTbGlkZSAyMilcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ1N0dWRlbnRUb3BpYycsIHtcbiAgICAgIHRvcGljTmFtZTogJ3N0dWRlbnRFdmVudHMtdG9waWMnXG4gICAgfSk7XG5cbiAgICAvLyAzLiDlu7rnq4sgU1FTIFF1ZXVlIChTbGlkZSAyMilcbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ1N0dWRlbnRRdWV1ZScsIHtcbiAgICAgIHF1ZXVlTmFtZTogJ3N0dWRlbnRFdmVudHMtcXVldWUnXG4gICAgfSk7XG5cbiAgICAvLyA0LiDlu7rnq4sgU05TIOWIsCBTUVMg55qE6KiC6Zax6Zec5L+CIChTbGlkZSAyMilcbiAgICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSk7XG5cbiAgICAvLyA1LiDlu7rnq4sgUHJvZHVjZXIgTGFtYmRhICjomZXnkIYgQVBJIOiri+axgikgKFNsaWRlIDIzKVxuICAgIGNvbnN0IHByb2R1Y2VyID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdTdHVkZW50c1Byb2R1Y2VyJywge1xuICAgICAgZnVuY3Rpb25OYW1lOiAnU3R1ZGVudHNQcm9kdWNlcicsIC8vIOaYjueiuuaMh+WumuWHveW8j+WQjeeosVxuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9sYW1iZGEvcHJvZHVjZXIudHMnKSwgLy8gTGFtYmRhIOeoi+W8j+eivOi3r+W+kVxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiB0YWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFRPUElDX0FSTjogdG9waWMudG9waWNBcm5cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIDYuIOW7uueriyBDb25zdW1lciBMYW1iZGEgKOiZleeQhuiDjOaZr+S7u+WLmSkgKFNsaWRlIDI0KVxuICAgIGNvbnN0IGNvbnN1bWVyID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdTdHVkZW50Q29uc3VtZXInLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6ICdTdHVkZW50Q29uc3VtZXInLCAvLyDmmI7norrmjIflrprlh73lvI/lkI3nqLFcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGFtYmRhL2NvbnN1bWVyLnRzJyksXG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICB9KTtcblxuICAgIC8vIDcuIOioreWumiBTUVMg5L2c54K6IENvbnN1bWVyIExhbWJkYSDnmoTkuovku7bkvobmupAgKFNsaWRlIDI0KVxuICAgIGNvbnN1bWVyLmFkZEV2ZW50U291cmNlKG5ldyBldmVudFNvdXJjZXMuU3FzRXZlbnRTb3VyY2UocXVldWUsIHtcbiAgICAgIGJhdGNoU2l6ZTogMTBcbiAgICB9KSk7XG5cbiAgICAvLyA4LiDmjojkuoggUHJvZHVjZXIgTGFtYmRhIOacgOWwj+asiumZkCAoU2xpZGUgMjUpXG4gICAgdGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHByb2R1Y2VyKTsgLy8g5o6I5LqI5bCNIER5bmFtb0RCIOeahOiugOWvq+asiumZkFxuICAgIHRvcGljLmdyYW50UHVibGlzaChwcm9kdWNlcik7ICAgICAgIC8vIOaOiOS6iOWwjSBTTlMg55qE55m85biD5qyK6ZmQXG5cbiAgICAvLyA5LiDmjojkuoggQ29uc3VtZXIgTGFtYmRhIOacgOWwj+asiumZkCAoU2xpZGUgMjUpXG4gICAgcXVldWUuZ3JhbnRDb25zdW1lTWVzc2FnZXMoY29uc3VtZXIpOyAvLyDmjojkuojlsI0gU1FTIOeahOiugOWPli/liKrpmaToqIrmga/mrIrpmZBcbiAgfVxufVxuIl19