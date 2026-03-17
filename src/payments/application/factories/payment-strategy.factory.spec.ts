import { Test } from "@nestjs/testing";
import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";
import { PaymentStrategy } from "../../domain/strategies/payment.strategy";
import { PaymentStrategyFactory } from "./payment-strategy.factory";
import { PaymentGatewayFactory } from "./payment-gateway.factory";
import { PixPaymentStrategy } from "../../infra/strategies/pix-payment.strategy";
import { CreditCardPaymentStrategy } from "../../infra/strategies/credit-card-payment.strategy";
import { BoletoPaymentStrategy } from "../../infra/strategies/boleto-payment.strategy";
import { FakeStripeAdapter } from "../../infra/gateways/adapters/fake-stripe.adapter";
import { FakeMercadoPagoAdapter } from "../../infra/gateways/adapters/fake-mercado-pago.adapter";

describe('PaymentStrategyFactory', () => {
    let factory: PaymentStrategyFactory;

    const pixStrategyMock = {
        supports: jest.fn((method) => method === PaymentMethod.PIX),
        execute: jest.fn(),
        paymentGatewayFactory: {} as PaymentGatewayFactory,
    } as unknown as PixPaymentStrategy;

    const creditCardStrategyMock = {
        supports: jest.fn((method) => method === PaymentMethod.CREDIT_CARD),
        execute: jest.fn(),
        paymentGatewayFactory: {} as PaymentGatewayFactory,
    } as unknown as CreditCardPaymentStrategy;

    const boletoStrategyMock = {
        supports: jest.fn((method) => method === PaymentMethod.BOLETO),
        execute: jest.fn(),
        paymentGatewayFactory: {} as PaymentGatewayFactory,
    } as unknown as BoletoPaymentStrategy;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: PaymentStrategyFactory,
                    useFactory: () =>
                        new PaymentStrategyFactory(
                            pixStrategyMock,
                            creditCardStrategyMock,
                            boletoStrategyMock,
                        ),
                },
                PaymentGatewayFactory,
                FakeMercadoPagoAdapter,
                FakeStripeAdapter,
            ],
        }).compile();

        factory = moduleRef.get<PaymentStrategyFactory>(PaymentStrategyFactory);
    });

    it('should return pix strategy', () => {
        const strategy = factory.create(PaymentMethod.PIX);

        expect(strategy).toBe(pixStrategyMock);
    });

    it('should return credit card strategy', () => {
        const strategy = factory.create(PaymentMethod.CREDIT_CARD);

        expect(strategy).toBe(creditCardStrategyMock);
    });

    it('should return boleto strategy', () => {
        const strategy = factory.create(PaymentMethod.BOLETO);

        expect(strategy).toBe(boletoStrategyMock);
    });

    it('should throw an error', () => {
        expect(() => factory.create(undefined as unknown as PaymentMethod)).toThrow("Unsupported payment method");
    })
});