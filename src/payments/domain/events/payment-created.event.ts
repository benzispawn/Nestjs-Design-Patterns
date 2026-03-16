import { PaymentMethod } from "../enums/payment-mehtod.enum";
import { PaymentProvider } from "../enums/payment-provider.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

export class PaymentCreatedEvent {
    constructor(
        public readonly paymentId: string,
        public readonly customerId: string,
        public readonly amount: number,
        public readonly method: PaymentMethod,
        public readonly provider: PaymentProvider,
        public readonly status: PaymentStatus,
    ) {}
}