// src/payment/providers/stripe.provider.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class StripeProvider {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.stripe.secretKey!, {
      apiVersion: '2024-06-20' as Stripe.StripeConfig['apiVersion'],
    });
  }

  async createCheckoutSession(userId: number, userEmail: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Plan - Unlimited Requests',
              description:
                'Get unlimited AI requests with our Pro Plan (one-time payment)',
            },
            unit_amount: 999, // $9.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.configService.app.frontendUrl}/payment/success`,
      cancel_url: `${this.configService.app.frontendUrl}/payment/cancel`,
      client_reference_id: userId.toString(),
      customer_email: userEmail,
      metadata: {
        userId: userId.toString(),
      },
    });

    return session;
  }

  constructEvent(body: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.configService.stripe.webhookSecret!,
    );
  }

  getStripeInstance() {
    return this.stripe;
  }
}
