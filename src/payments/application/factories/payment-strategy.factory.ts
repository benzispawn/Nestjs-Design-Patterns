import { Injectable } from "@nestjs/common";
import { BoletoPaymentStrategy } from "../../infra/strategies/boleto-payment.strategy";
import { CreditCardPaymentStrategy } from "../../infra/strategies/credit-card-payment.strategy";
import { PixPaymentStrategy } from "../../infra/strategies/pix-payment.strategy";
import { PaymentStrategy } from "../../domain/strategies/payment.strategy";
import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";

@Injectable()
export class PaymentStrategyFactory {
    private readonly strategies: PaymentStrategy[];

    constructor(
        private readonly pixStrategy: PixPaymentStrategy,
        private readonly creditCardStrategy: CreditCardPaymentStrategy,
        private readonly boletoStrategy: BoletoPaymentStrategy,
    ) {
        this.strategies = [
            this.pixStrategy,
            this.creditCardStrategy,
            this.boletoStrategy,
        ]
    }

    create(method: PaymentMethod): PaymentStrategy {
        const strategy = this.strategies.find(s => s.supports(method));
        if (!strategy) {
            throw new Error("Unsupported payment method");
        }
        return strategy;
    }
}