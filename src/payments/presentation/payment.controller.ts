import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';

import { CreatePaymentDto } from '../application/dto/create-payment.dto';
import { CreatePaymentService } from '../application/services/create-payment.service';
import { PaymentRepository } from '../domain/repositories/payment.repository';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createPaymentService: CreatePaymentService,
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return this.createPaymentService.execute(dto);
  }

  @Get()
  async findAll() {
    return this.paymentRepository.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paymentRepository.findById(id);
  }
}
