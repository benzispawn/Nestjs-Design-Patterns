import { Injectable } from '@nestjs/common';

import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';

@Injectable()
export class InMemoryPaymentRepository extends PaymentRepository {
  private readonly payments = new Map<string, Payment>();

  async save(payment: Payment): Promise<void> {
    await new Promise((resolve) =>
      resolve(this.payments.set(payment.id, payment)),
    );
  }

  async findById(id: string): Promise<Payment | null> {
    return new Promise((resolve) => resolve(this.payments.get(id) ?? null));
  }

  async findAll(): Promise<Payment[]> {
    return new Promise((resolve) =>
      resolve(Array.from(this.payments.values())),
    );
  }
}
