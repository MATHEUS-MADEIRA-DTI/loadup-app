import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    webpush.setVapidDetails(
      this.config.get<string>('VAPID_SUBJECT')!,
      this.config.get<string>('VAPID_PUBLIC_KEY')!,
      this.config.get<string>('VAPID_PRIVATE_KEY')!,
    );
  }

  getPublicKey(): string {
    return this.config.get<string>('VAPID_PUBLIC_KEY')!;
  }

  schedulePush(subscription: webpush.PushSubscription, delaySeconds: number): void {
    const payload = JSON.stringify({
      title: 'Descanso encerrado!',
      body: 'Hora de voltar ao treino 💪',
    });
    setTimeout(() => {
      webpush
        .sendNotification(subscription, payload)
        .catch((err) => this.logger.warn('Push failed', err));
    }, delaySeconds * 1000);
  }
}
