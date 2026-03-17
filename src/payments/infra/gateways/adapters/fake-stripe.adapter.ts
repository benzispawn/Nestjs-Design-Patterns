import { PaymentProvider } from "../../../domain/enums/payment-provider.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { GatewayChargeInput, GatewayChargeResult, PaymentGateway } from "../../../domain/gateways/payment-gateway";

export class FakeStripeAdapter implements PaymentGateway {
    readonly provider = PaymentProvider.STRIPE;
    async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
        return {
            externalId: `st_${input.customerId}_${Date.now()}`,
            status: PaymentStatus.APPROVED,
        }
    }
}