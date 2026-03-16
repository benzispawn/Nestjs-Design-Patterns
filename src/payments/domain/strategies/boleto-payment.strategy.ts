import { Injectable } from "@nestjs/common";
import { ExecutePaymentInput, ExecutePaymentResult, PaymentStrategy } from "./payment.strategy";
import { PaymentProvider } from "../enums/payment-provider.enum";
import { PaymentGateway } from "../../infra/gateways/payment-gateway";
import { FakeMercadoPagoAdapter } from "../../infra/gateways/adapters/fake-mercado-pago.adapter";
import { FakeStripeAdapter } from "../../infra/gateways/adapters/fake-stripe.adapter";
import { PaymentStatus } from "../enums/payment-status.enum";
import { PaymentMethod } from "../enums/payment-mehtod.enum";


@Injectable()
export class BoletoPaymentStrategy implements PaymentStrategy {
  async execute(input: ExecutePaymentInput): Promise<ExecutePaymentResult> {
    const gateway = this.resolveGateway(input.provider);
    const result = await gateway.charge({
      amount: input.amount,
      customerId: input.customerId,
      method: PaymentMethod.BOLETO,
    });

    return {
      status: this.mapStatus(result.status),
      externalId: result.externalId,
    };
  }

  private resolveGateway(provider: PaymentProvider): PaymentGateway {
    switch (provider) {
      case PaymentProvider.MERCADO_PAGO:
        return new FakeMercadoPagoAdapter();
      case PaymentProvider.STRIPE:
        return new FakeStripeAdapter();
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private mapStatus(status: 'approved' | 'failed' | 'pending'): PaymentStatus {
    switch (status) {
      case 'approved':
        return PaymentStatus.APPROVED;
      case 'failed':
        return PaymentStatus.FAILED;
      default:
        return PaymentStatus.PENDING;
    }
  }
}