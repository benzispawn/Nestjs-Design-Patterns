import type { PaymentMethod } from '../enums/payment-mehtod.enum';
import type { PaymentProvider } from '../enums/payment-provider.enum';
import type { PaymentStatus } from '../enums/payment-status.enum';

export interface GatewayChargeInput {
  amount: number;
  customerId: string;
  method: PaymentMethod;
}

export interface GatewayChargeResult {
  externalId: string;
  status: PaymentStatus;
}

export interface PaymentGateway {
  readonly provider: PaymentProvider;
  charge(input: GatewayChargeInput): Promise<GatewayChargeResult>;
}
