import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './payments/payments.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PaymentModule,
  ],
})
export class AppModule {}