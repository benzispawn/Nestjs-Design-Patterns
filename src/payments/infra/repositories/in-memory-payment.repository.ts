import { Injectable } from "@nestjs/common";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { Payment } from "../../domain/entities/payment.entity";

@Injectable()
export class InMemoryPaymentRepository extends PaymentRepository{
    private readonly payments = new Map<string, Payment>();

    async save(payment: Payment): Promise<void> {
        this.payments.set(payment.id, payment);
    }

    async findById(id: string): Promise<Payment | null> {
        return this.payments.get(id) ?? null;
    }

    async findAll(): Promise<Payment[]> {
        return Array.from(this.payments.values());
    }
}