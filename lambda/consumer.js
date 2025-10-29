"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// lambda/consumer.ts
const handler = async (event) => {
    console.log(`Received ${event.Records.length} records from SQS.`);
    // Lambda 可能一次接收多筆 SQS 訊息
    for (const record of event.Records) {
        try {
            // SQS 訊息的 body 是字串,需要解析成物件
            const snsMessage = JSON.parse(record.body);
            // SNS 訊息會被包裝在 Message 欄位中
            const payload = JSON.parse(snsMessage.Message);
            // 記錄到 CloudWatch Logs (模擬背景任務)
            console.log(`StudentCreated: Name: ${payload.name}, Email: ${payload.email}, ID: ${payload.Id}`);
            // TODO: 在這裡實作真正的背景任務
            // - 寄送歡迎信件給新學生
            // - 寫入審核記錄表
            // - 同步資料到外部系統(例如 CRM)
        }
        catch (error) {
            console.error('Error processing record:', error);
        }
    }
    // 回傳成功狀態 (SQS 會自動刪除已處理的訊息)
    return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
    };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3VtZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdW1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQkFBcUI7QUFDZCxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLEVBQUU7SUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxvQkFBb0IsQ0FBQyxDQUFDO0lBRWxFLHlCQUF5QjtJQUN6QixLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUM7WUFDSCwyQkFBMkI7WUFDM0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFM0MsMEJBQTBCO1lBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRS9DLCtCQUErQjtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLHlCQUF5QixPQUFPLENBQUMsSUFBSSxZQUFZLE9BQU8sQ0FBQyxLQUFLLFNBQVMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFakcscUJBQXFCO1lBQ3JCLGVBQWU7WUFDZixZQUFZO1lBQ1osc0JBQXNCO1FBQ3hCLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUVELDJCQUEyQjtJQUMzQixPQUFPO1FBQ0wsVUFBVSxFQUFFLEdBQUc7UUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNuQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBN0JXLFFBQUEsT0FBTyxXQTZCbEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsYW1iZGEvY29uc3VtZXIudHNcbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnkpID0+IHtcbiAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7ZXZlbnQuUmVjb3Jkcy5sZW5ndGh9IHJlY29yZHMgZnJvbSBTUVMuYCk7XG5cbiAgLy8gTGFtYmRhIOWPr+iDveS4gOasoeaOpeaUtuWkmuethiBTUVMg6KiK5oGvXG4gIGZvciAoY29uc3QgcmVjb3JkIG9mIGV2ZW50LlJlY29yZHMpIHtcbiAgICB0cnkge1xuICAgICAgLy8gU1FTIOioiuaBr+eahCBib2R5IOaYr+Wtl+S4sizpnIDopoHop6PmnpDmiJDnianku7ZcbiAgICAgIGNvbnN0IHNuc01lc3NhZ2UgPSBKU09OLnBhcnNlKHJlY29yZC5ib2R5KTtcblxuICAgICAgLy8gU05TIOioiuaBr+acg+iiq+WMheijneWcqCBNZXNzYWdlIOashOS9jeS4rVxuICAgICAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2Uoc25zTWVzc2FnZS5NZXNzYWdlKTtcblxuICAgICAgLy8g6KiY6YyE5YiwIENsb3VkV2F0Y2ggTG9ncyAo5qih5pOs6IOM5pmv5Lu75YuZKVxuICAgICAgY29uc29sZS5sb2coYFN0dWRlbnRDcmVhdGVkOiBOYW1lOiAke3BheWxvYWQubmFtZX0sIEVtYWlsOiAke3BheWxvYWQuZW1haWx9LCBJRDogJHtwYXlsb2FkLklkfWApO1xuXG4gICAgICAvLyBUT0RPOiDlnKjpgJnoo6Hlr6bkvZznnJ/mraPnmoTog4zmma/ku7vli5lcbiAgICAgIC8vIC0g5a+E6YCB5q2h6L+O5L+h5Lu257Wm5paw5a2455SfXG4gICAgICAvLyAtIOWvq+WFpeWvqeaguOiomOmMhOihqFxuICAgICAgLy8gLSDlkIzmraXos4fmlpnliLDlpJbpg6jns7vntbEo5L6L5aaCIENSTSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIHJlY29yZDonLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLy8g5Zue5YKz5oiQ5Yqf54uA5oWLIChTUVMg5pyD6Ieq5YuV5Yiq6Zmk5bey6JmV55CG55qE6KiK5oGvKVxuICByZXR1cm4ge1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG9rOiB0cnVlIH0pXG4gIH07XG59O1xuIl19