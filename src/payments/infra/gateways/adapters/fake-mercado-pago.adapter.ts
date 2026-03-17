import { PaymentProvider } from "../../../domain/enums/payment-provider.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { GatewayChargeInput, GatewayChargeResult, PaymentGateway } from "../../../domain/gateways/payment-gateway";

export class FakeMercadoPagoAdapter implements PaymentGateway {
    readonly provider = PaymentProvider.MERCADO_PAGO;
    async charge(input: GatewayChargeInput): Promise<GatewayChargeResult> {
        return {
            externalId: `mp_${input.customerId}_${Date.now()}`,
            status: PaymentStatus.APPROVED,
        }
    }
}