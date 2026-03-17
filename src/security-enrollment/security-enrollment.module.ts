import { Module } from "@nestjs/common";
import { SecurityEnrollmentController } from "./security-enrollment.controller";
import { SecurityEnrollmentService } from "./security-enrollment.service";
import { HttpSecurityEnrollmentGateway } from "./security-enrollment.gateway";
import { HttpModule } from "@nestjs/axios";
import { SecurityEnrollmentExceptionFilter } from "./errors/security-enrollment-error.filter";

@Module({
    controllers: [SecurityEnrollmentController],
    imports: [HttpModule],
    providers: [SecurityEnrollmentService, HttpSecurityEnrollmentGateway, {
        provide: 'APP_FILTER',
        useClass: SecurityEnrollmentExceptionFilter
    }],
})

export class SecurityEnrollmentModule {}