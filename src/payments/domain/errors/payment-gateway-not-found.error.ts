import type { PaymentProvider } from '../enums/payment-provider.enum';

export class PaymentGatewayNotFoundError extends Error {
  constructor(provider: PaymentProvider) {
    super(`Payment gateway not found for provider: ${provider}`);
    this.name = 'PaymentGatewayNotFoundError';
  }
}
