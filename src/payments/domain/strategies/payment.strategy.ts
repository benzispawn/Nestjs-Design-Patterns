import type { PaymentMethod } from '../enums/payment-mehtod.enum';
import type { PaymentProvider } from '../enums/payment-provider.enum';
import type { PaymentStatus } from '../enums/payment-status.enum';

export interface ExecutePaymentInput {
  amount: number;
  customerId: string;
  provider: PaymentProvider;
}

export interface ExecutePaymentResult {
  status: PaymentStatus;
  externalId: string | null;
}

export interface PaymentStrategy {
  supports(method: PaymentMethod): boolean;
  execute(input: ExecutePaymentInput): Promise<ExecutePaymentResult>;
}
