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
}
