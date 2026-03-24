import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

import { PaymentMethod } from '../../domain/enums/payment-mehtod.enum';
import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @MinLength(3)
  customerId!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsEnum(PaymentProvider)
  provider!: PaymentProvider;
}
