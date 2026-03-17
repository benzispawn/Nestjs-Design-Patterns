import { PaymentMethod } from "../enums/payment-mehtod.enum";
import { PaymentProvider } from "../enums/payment-provider.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

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