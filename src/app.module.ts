import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './payments/payments.module';
import { SecurityEnrollmentModule } from './security-enrollment/security-enrollment.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PaymentModule,
    SecurityEnrollmentModule,
  ],
})
export class AppModule {}