import { Payment } from "../entities/payment.entity";

export abstract class PaymentRepository {
    abstract save(payment: Payment): Promise<void>;
    abstract findById(id: string): Promise<Payment | null>;
    abstract findAll(): Promise<Payment[]>;
}