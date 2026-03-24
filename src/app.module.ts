import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EligibilityModule } from './client-eligibility/client-eligibility.module';
import { PaymentModule } from './payments/payments.module';
import { SecurityEnrollmentModule } from './security-enrollment/security-enrollment.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PaymentModule,
    SecurityEnrollmentModule,
    EligibilityModule,
  ],
})
export class AppModule {}
