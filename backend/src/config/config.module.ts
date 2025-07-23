import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { validationSchema } from './config.schema';
import jwtConfig from 'src/auth/config/jwt.config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [jwtConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService, NestConfigModule],
})
export class ConfigModule {}
