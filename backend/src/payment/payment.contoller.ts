// src/payment/payment.controller.ts
import {
  Controller,
  Post,
  Headers,
  RawBody,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './providers/payment.service';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@ActiveUser('sub') userId: number) {
    const session = await this.paymentService.createCheckoutSession(userId);
    return { url: session.url };
  }

  @Post('webhook')
  @Auth(AuthType.None)
  async handleWebhook(
    @RawBody() body: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      await this.paymentService.handleWebhook(body, signature);
      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }
}
