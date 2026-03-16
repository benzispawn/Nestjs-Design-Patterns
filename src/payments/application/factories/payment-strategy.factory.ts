import { Injectable } from "@nestjs/common";
import { BoletoPaymentStrategy } from "../../domain/strategies/boleto-payment.strategy";
import { CreditCardPaymentStrategy } from "../../domain/strategies/credit-card-payment.strategy";
import { PixPaymentStrategy } from "../../domain/strategies/pix-payment.strategy";
import { PaymentStrategy } from "../../domain/strategies/payment.strategy";
import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";

@Injectable()
export class PaymentStrategyFactory {
    constructor(
        private readonly pixStrategy: PixPaymentStrategy,
        private readonly creditCardStrategy: CreditCardPaymentStrategy,
        private readonly boletoStrategy: BoletoPaymentStrategy,
    ) {}

    create(method: PaymentMethod): PaymentStrategy {
        switch (method) {
            case PaymentMethod.PIX:
                return this.pixStrategy;
            case PaymentMethod.CREDIT_CARD:
                return this.creditCardStrategy;
            case PaymentMethod.BOLETO:
                return this.boletoStrategy;
            default:
                throw new Error("Unsupported payment method");
        }
    }
}