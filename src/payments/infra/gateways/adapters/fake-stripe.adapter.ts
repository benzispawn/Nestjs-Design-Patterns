import { PaymentProvider } from '../../../domain/enums/payment-provider.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

import type {
  GatewayChargeInput,
  GatewayChargeResult,
  PaymentGateway,
} from '../../../domain/gateways/payment-gateway';

export class FakeStripeAdapter implements PaymentGateway {
  readonly provider = PaymentProvider.STRIPE;
  async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
    return new Promise((resolve) =>
      resolve({
        externalId: `st_${input.customerId}_${Date.now()}`,
        status: PaymentStatus.APPROVED,
      }),
    );
  }
}
