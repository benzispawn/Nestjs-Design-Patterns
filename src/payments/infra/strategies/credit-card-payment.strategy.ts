import { Injectable } from "@nestjs/common";
import { ExecutePaymentInput, ExecutePaymentResult, PaymentStrategy } from "../../domain/strategies/payment.strategy";
import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";
import { PaymentGatewayFactory } from "../../application/factories/payment-gateway.factory";
import { GatewayStatusMapper } from "../../application/mappers/gateway-status.mapper";


@Injectable()
export class CreditCardPaymentStrategy implements PaymentStrategy {

  constructor(
    private readonly paymentGatewayFactory: PaymentGatewayFactory,
  ) {}

  supports(method: PaymentMethod): boolean {
    return method === PaymentMethod.CREDIT_CARD;
  }

  async execute(input: ExecutePaymentInput): Promise<ExecutePaymentResult> {
    const gateway = this.paymentGatewayFactory.create(input.provider);
    const result = await gateway.charge({
      amount: input.amount,
      customerId: input.customerId,
      method: PaymentMethod.CREDIT_CARD,
    });

    return {
      status: GatewayStatusMapper.toDomain(result.status),
      externalId: result.externalId,
    };
  }

}