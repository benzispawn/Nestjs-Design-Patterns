import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PaymentCreatedEvent } from '../../domain/events/payment-created.event';

@Injectable()
export class PaymentCreatedListener {
  private readonly logger = new Logger(PaymentCreatedListener.name);

  @OnEvent('payment.created')
  handle(event: PaymentCreatedEvent): void {
    this.logger.log(
      `Payment created: id=${event.paymentId}, customer=${event.customerId}, amount=${event.amount}, method=${event.method}, provider=${event.provider}, status=${event.status}`,
    );
  }
}
