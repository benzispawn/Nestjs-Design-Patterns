import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";
import { PaymentStatus } from "../../domain/enums/payment-status.enum";

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
    charge(input: GatewayChargeInput): Promise<GatewayChargeResult>;
}