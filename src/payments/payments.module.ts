import { Module } from '@nestjs/common';
import { CreatePaymentService } from './application/services/create-payment.service';
import { PaymentStrategyFactory } from './application/factories/payment-strategy.factory';
import { PaymentController } from './presentation/payment.controller';
import { InMemoryPaymentRepository } from './infra/repositories/in-memory-payment.repository';
import { PaymentCreatedListener } from './infra/listeners/payment-created.listener';
import { PixPaymentStrategy } from './domain/strategies/pix-payment.strategy';
import { CreditCardPaymentStrategy } from './domain/strategies/credit-card-payment.strategy';
import { BoletoPaymentStrategy } from './domain/strategies/boleto-payment.strategy';

@Module({
  controllers: [PaymentController],
  providers: [
    CreatePaymentService,
    PaymentStrategyFactory,
    PixPaymentStrategy,
    CreditCardPaymentStrategy,
    BoletoPaymentStrategy,
    PaymentCreatedListener,
    InMemoryPaymentRepository,
    {
      provide: 'PaymentRepository',
      useExisting: InMemoryPaymentRepository,
    },
  ],
})
export class PaymentModule {}