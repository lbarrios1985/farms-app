import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';

class QueueService {
  private sbClient: ServiceBusClient;
  private queueName = 'notifications';

  constructor() {
    const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING || '';
    this.sbClient = new ServiceBusClient(connectionString);
  }

  async sendMessage(message: any) {
    const sender = this.sbClient.createSender(this.queueName);
    
    try {
      const sbMessage: ServiceBusMessage = {
        body: message,
        contentType: 'application/json',
      };
      
      await sender.sendMessages(sbMessage);
    } finally {
      await sender.close();
    }
  }

  async startMessageConsumer(messageHandler: (message: any) => Promise<void>) {
    const receiver = this.sbClient.createReceiver(this.queueName);

    receiver.subscribe({
      processMessage: async (message) => {
        await messageHandler(message.body);
      },
      processError: async (error) => {
        console.error('Error processing message:', error);
      },
    });
  }

  async close() {
    await this.sbClient.close();
  }
}

export const queueService = new QueueService();
