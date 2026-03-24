import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SecurityEnrollmentExceptionFilter } from './errors/security-enrollment-error.filter';
import { SecurityEnrollmentController } from './security-enrollment.controller';
import { HttpSecurityEnrollmentGateway } from './security-enrollment.gateway';
import { SecurityEnrollmentService } from './security-enrollment.service';

@Module({
  controllers: [SecurityEnrollmentController],
  imports: [HttpModule],
  providers: [
    SecurityEnrollmentService,
    HttpSecurityEnrollmentGateway,
    {
      provide: 'APP_FILTER',
      useClass: SecurityEnrollmentExceptionFilter,
    },
  ],
})
export class SecurityEnrollmentModule {}
