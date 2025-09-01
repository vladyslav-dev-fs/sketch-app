// src/payment/providers/payment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeProvider } from './stripe.provider';
import { UsersService } from 'src/users/providers/users.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeProvider: StripeProvider,
    private readonly usersService: UsersService,
  ) {}

  async createCheckoutSession(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.stripeProvider.createCheckoutSession(user.id, user.email);
  }

  async handleWebhook(body: Buffer, signature: string) {
    const event = this.stripeProvider.constructEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    if (!session.metadata || !session.metadata.userId) {
      console.warn('Missing metadata.userId in checkout session');
      return;
    }

    const userId = parseInt(session.metadata.userId, 10);
    const user = await this.usersService.findById(userId);

    if (user) {
      await this.usersService.upgradeToProPlan(
        userId,
        session.customer as string,
      );
    }
  }
}
