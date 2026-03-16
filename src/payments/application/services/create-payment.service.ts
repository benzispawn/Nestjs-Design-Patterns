import { Inject, Injectable } from "@nestjs/common";
import { PaymentStrategyFactory } from "../factories/payment-strategy.factory";
import { PaymentRepository } from "../../domain/repositories/payment.repository";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { Payment } from "../../domain/entities/payment.entity";
import { v4 as uuidv4 } from 'uuid';
import { PaymentCreatedEvent } from "../../domain/events/payment-created.event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class CreatePaymentService {
  constructor(
    private readonly paymentStrategyFactory: PaymentStrategyFactory,
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: CreatePaymentDto): Promise<Payment> {
    const strategy = this.paymentStrategyFactory.create(dto.method);

    const executionResult = await strategy.execute({
      amount: dto.amount,
      customerId: dto.customerId,
      provider: dto.provider,
    });

    const payment = new Payment(
      uuidv4(),
      dto.customerId,
      dto.amount,
      dto.method,
      dto.provider,
      executionResult.status,
      executionResult.externalId,
      new Date(),
    );

    await this.paymentRepository.save(payment);

    this.eventEmitter.emit(
      'payment.created',
      new PaymentCreatedEvent(
        payment.id,
        payment.customerId,
        payment.amount,
        payment.method,
        payment.provider,
        payment.status,
      ),
    );

    return payment;
  }
}