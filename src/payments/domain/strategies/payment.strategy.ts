import { PaymentProvider } from "../enums/payment-provider.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

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
    execute(input: ExecutePaymentInput): Promise<ExecutePaymentResult>;
}