import { PaymentProvider } from '../../../domain/enums/payment-provider.enum';
import { PaymentStatus } from '../../../domain/enums/payment-status.enum';

import type {
  GatewayChargeInput,
  GatewayChargeResult,
  PaymentGateway,
} from '../../../domain/gateways/payment-gateway';

export class FakeMercadoPagoAdapter implements PaymentGateway {
  readonly provider = PaymentProvider.MERCADO_PAGO;
  async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
    return new Promise((resolve) =>
      resolve({
        externalId: `mp_${input.customerId}_${Date.now()}`,
        status: PaymentStatus.APPROVED,
      }),
    );
  }
}
