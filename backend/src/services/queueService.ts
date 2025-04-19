// Simplified queue service that just logs to console
class QueueService {
  async sendMessage(message: any) {
    console.log('🔔 Notification:', message);
  }

  async startMessageConsumer(messageHandler: (message: any) => Promise<void>) {
    console.log('📫 Message consumer started (notifications will be logged to console)');
  }

  async close() {
    console.log('📪 Message consumer closed');
  }
}

export const queueService = new QueueService();
