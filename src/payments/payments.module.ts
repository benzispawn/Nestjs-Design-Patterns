import { Module } from '@nestjs/common';

import { PaymentGatewayFactory } from './application/factories/payment-gateway.factory';
import { PaymentStrategyFactory } from './application/factories/payment-strategy.factory';
import { CreatePaymentService } from './application/services/create-payment.service';
import { FakeMercadoPagoAdapter } from './infra/gateways/adapters/fake-mercado-pago.adapter';
import { FakeStripeAdapter } from './infra/gateways/adapters/fake-stripe.adapter';
import { PaymentCreatedListener } from './infra/listeners/payment-created.listener';
import { InMemoryPaymentRepository } from './infra/repositories/in-memory-payment.repository';
import { BoletoPaymentStrategy } from './infra/strategies/boleto-payment.strategy';
import { CreditCardPaymentStrategy } from './infra/strategies/credit-card-payment.strategy';
import { PixPaymentStrategy } from './infra/strategies/pix-payment.strategy';
import { PaymentController } from './presentation/payment.controller';

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
