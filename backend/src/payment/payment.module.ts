// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './providers/payment.service';
import { StripeProvider } from './providers/stripe.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeProvider],
  exports: [PaymentService],
})
export class PaymentModule {}
