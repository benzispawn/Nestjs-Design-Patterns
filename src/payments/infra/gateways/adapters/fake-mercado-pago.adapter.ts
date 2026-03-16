import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { GatewayChargeInput, GatewayChargeResult, PaymentGateway } from "../payment-gateway";

export class FakeMercadoPagoAdapter implements PaymentGateway {
    async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
        return {
            externalId: `mp_${input.customerId}_${Date.now()}`,
            status: PaymentStatus.APPROVED,
        }
    }
}