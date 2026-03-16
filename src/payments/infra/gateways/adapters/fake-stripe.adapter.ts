import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { GatewayChargeInput, GatewayChargeResult, PaymentGateway } from "../payment-gateway";

export class FakeStripeAdapter implements PaymentGateway {
    async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
        return {
            externalId: `st_${input.customerId}_${Date.now()}`,
            status: PaymentStatus.APPROVED,
        }
    }
}