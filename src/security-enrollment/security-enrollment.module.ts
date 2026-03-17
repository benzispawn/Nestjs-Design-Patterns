import { Module } from "@nestjs/common";
import { SecurityEnrollmentController } from "./security-enrollment.controller";
import { SecurityEnrollmentService } from "./security-enrollment.service";
import { HttpSecurityEnrollmentGateway } from "./security-enrollment.gateway";
import { HttpModule } from "@nestjs/axios";

@Module({
    controllers: [SecurityEnrollmentController],
    imports: [HttpModule],
    providers: [SecurityEnrollmentService, HttpSecurityEnrollmentGateway],
})

export class SecurityEnrollmentModule {}