// lambda/consumer.ts
export const handler = async (event: any) => {
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
    } catch (error) {
        console.error('Error processing record:', error);
    }
  }

  // 回傳成功狀態 (SQS 會自動刪除已處理的訊息)
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
