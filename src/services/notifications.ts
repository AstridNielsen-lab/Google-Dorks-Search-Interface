interface WhatsAppMessage {
  text: string;
  timestamp: number;
  isFromUser: boolean;
}

class WhatsAppNotificationManager {
  private static instance: WhatsAppNotificationManager;
  private messages: WhatsAppMessage[] = [];
  private onMessageCallbacks: ((message: WhatsAppMessage) => void)[] = [];

  private constructor() {
    this.setupNotificationListener();
  }

  public static getInstance(): WhatsAppNotificationManager {
    if (!WhatsAppNotificationManager.instance) {
      WhatsAppNotificationManager.instance = new WhatsAppNotificationManager();
    }
    return WhatsAppNotificationManager.instance;
  }

  private setupNotificationListener() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('message', event => {
          if (event.data.type === 'whatsapp_notification') {
            const message: WhatsAppMessage = {
              text: event.data.text,
              timestamp: Date.now(),
              isFromUser: true
            };
            this.handleNewMessage(message);
          }
        });
      });
    }
  }

  private handleNewMessage(message: WhatsAppMessage) {
    this.messages.push(message);
    this.onMessageCallbacks.forEach(callback => callback(message));
  }

  public onMessage(callback: (message: WhatsAppMessage) => void) {
    this.onMessageCallbacks.push(callback);
    return () => {
      this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
    };
  }

  public async sendMessage(text: string): Promise<void> {
    const message: WhatsAppMessage = {
      text,
      timestamp: Date.now(),
      isFromUser: false
    };

    this.messages.push(message);

    // Create and show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        await new Notification('Google Dorks Pro', {
          body: text,
          icon: '/favicon.svg'
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }

  public getMessages(): WhatsAppMessage[] {
    return [...this.messages];
  }

  public clearMessages() {
    this.messages = [];
  }
}

export const whatsAppManager = WhatsAppNotificationManager.getInstance();