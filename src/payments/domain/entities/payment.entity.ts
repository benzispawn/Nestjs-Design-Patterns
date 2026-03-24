import type { PaymentMethod } from '../enums/payment-mehtod.enum';
import type { PaymentProvider } from '../enums/payment-provider.enum';
import type { PaymentStatus } from '../enums/payment-status.enum';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly amount: number,
    public readonly method: PaymentMethod,
    public readonly provider: PaymentProvider,
    public status: PaymentStatus,
    public readonly externalId: string | null,
    public readonly createdAt: Date = new Date(),
  ) {}
}
