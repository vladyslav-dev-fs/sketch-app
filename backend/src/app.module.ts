import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';
import { AuthModule } from 'src/auth/auth.module';
import { ItemsModule } from 'src/items/items.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        username: config.database.username,
        password: config.database.password,
        database: config.database.name,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    ItemsModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
