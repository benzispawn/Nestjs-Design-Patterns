import { Module } from '@nestjs/common';
import { CreatePaymentService } from './application/services/create-payment.service';
import { PaymentStrategyFactory } from './application/factories/payment-strategy.factory';
import { PaymentController } from './presentation/payment.controller';
import { InMemoryPaymentRepository } from './infra/repositories/in-memory-payment.repository';
import { PaymentCreatedListener } from './infra/listeners/payment-created.listener';
import { PixPaymentStrategy } from './infra/strategies/pix-payment.strategy';
import { CreditCardPaymentStrategy } from './infra/strategies/credit-card-payment.strategy';
import { BoletoPaymentStrategy } from './infra/strategies/boleto-payment.strategy';
import { FakeMercadoPagoAdapter } from './infra/gateways/adapters/fake-mercado-pago.adapter';
import { FakeStripeAdapter } from './infra/gateways/adapters/fake-stripe.adapter';
import { PaymentGatewayFactory } from './application/factories/payment-gateway.factory';

@Module({
  controllers: [PaymentController],
  providers: [
    CreatePaymentService,
    PaymentStrategyFactory,
    PaymentGatewayFactory,
    PixPaymentStrategy,
    CreditCardPaymentStrategy,
    BoletoPaymentStrategy,
    PaymentCreatedListener,
    FakeMercadoPagoAdapter,
    FakeStripeAdapter,
    InMemoryPaymentRepository,
    {
      provide: 'PaymentRepository',
      useExisting: InMemoryPaymentRepository,
    },
  ],
})
export class PaymentModule {}