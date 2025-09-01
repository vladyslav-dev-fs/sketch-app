import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get database() {
    return {
      host: this.config.get<string>('DB_HOST'),
      port: this.config.get<number>('DB_PORT'),
      username: this.config.get<string>('DB_USERNAME'),
      password: this.config.get<string>('DB_PASSWORD'),
      name: this.config.get<string>('DB_NAME'),
    };
  }

  get jwt() {
    return {
      secret: this.config.get<string>('JWT_SECRET'),
      refreshSecret: this.config.get<string>('JWT_REFRESH_SECRET'),
    };
  }

  get openRouter() {
    return {
      apiKey: this.config.get<string>('OPENROUTER_API_KEY'),
    };
  }

  get stripe() {
    return {
      secretKey: this.config.get<string>('STRIPE_SECRET_KEY'),
      webhookSecret: this.config.get<string>('STRIPE_WEBHOOK_SECRET'),
      publishableKey: this.config.get<string>('STRIPE_PUBLISHABLE_KEY'),
    };
  }

  get app() {
    return {
      frontendUrl: this.config.get<string>(
        'FRONTEND_URL',
        'http://localhost:3001',
      ),
    };
  }
}
