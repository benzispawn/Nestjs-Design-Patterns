import { Injectable } from "@nestjs/common";
import { PaymentProvider } from "../../domain/enums/payment-provider.enum";
import { PaymentGateway } from "../../domain/gateways/payment-gateway";
import { FakeMercadoPagoAdapter } from "../../infra/gateways/adapters/fake-mercado-pago.adapter";
import { FakeStripeAdapter } from "../../infra/gateways/adapters/fake-stripe.adapter";

@Injectable()
export class PaymentGatewayFactory {
    private readonly gateways = new Map<PaymentProvider, PaymentGateway>();

    constructor(
        private readonly mercadoPagoGateway: FakeMercadoPagoAdapter,
        private readonly stripeGateway: FakeStripeAdapter, // Substitua pelo adaptador real do Stripe
    ) {
        this.gateways = new Map<PaymentProvider, PaymentGateway>([
            [this.mercadoPagoGateway.provider, this.mercadoPagoGateway],
            [this.stripeGateway.provider, this.stripeGateway],
        ]);
    }

    create(provider: PaymentProvider): PaymentGateway {
        const gateway = this.gateways.get(provider);
        if (!gateway) {
            throw new Error(`Unsupported payment provider: ${provider}`);
        }
        return gateway;
    }

}