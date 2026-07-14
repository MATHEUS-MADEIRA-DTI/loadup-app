import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  // Chaveado pelo endpoint da subscription — no máximo um push de fim de
  // descanso pendente por dispositivo, então dá pra cancelar por essa chave.
  private readonly pending = new Map<string, NodeJS.Timeout>();

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
    this.cancelPush(subscription.endpoint);
    this.logger.log(
      `Scheduling push for ${subscription.endpoint} in ${delaySeconds}s`,
    );
    const timeout = setTimeout(() => {
      this.pending.delete(subscription.endpoint);
      this.logger.log(`Sending push now to ${subscription.endpoint}`);
      webpush
        .sendNotification(subscription, payload)
        .then((res) =>
          this.logger.log(
            `Push sent OK to ${subscription.endpoint} — status ${res.statusCode}`,
          ),
        )
        .catch((err) =>
          this.logger.warn(
            `Push FAILED for ${subscription.endpoint} — status ${err?.statusCode}, body: ${err?.body}`,
          ),
        );
    }, delaySeconds * 1000);
    this.pending.set(subscription.endpoint, timeout);
  }

  cancelPush(endpoint: string): void {
    const timeout = this.pending.get(endpoint);
    if (!timeout) return;
    clearTimeout(timeout);
    this.pending.delete(endpoint);
    this.logger.log(`Cancelled pending push for ${endpoint}`);
  }
}
