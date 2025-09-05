// src/services/notification.service.js
import { PushNotifications } from '@capacitor/push-notifications';

class NotificationService {
  async initializePushNotifications() {
    // Request permission
    const result = await PushNotifications.requestPermissions();
    
    if (result.receive === 'granted') {
      await PushNotifications.register();
    }

    // Register listeners
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ', token.value);
      // Send token to your backend
      this.sendTokenToServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ', notification);
    });
  }

  async sendTokenToServer(token) {
    // Send FCM token to your Django backend
    try {
      await ApiService.saveFCMToken(token);
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  }
}

export default new NotificationService();