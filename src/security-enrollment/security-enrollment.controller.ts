import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import { SecurityEnrollmentService } from "./security-enrollment.service";
import type { SecurityEnrollmentInput } from "./security-enrollment.gateway";
import { SecurityEnrollmentExceptionFilter } from "./errors/security-enrollment-error.filter";


@Controller('security-enrollment')
export class SecurityEnrollmentController {
  constructor(
    private readonly enrollSecurityService: SecurityEnrollmentService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseFilters(SecurityEnrollmentExceptionFilter)
  async enroll(@Body() body: SecurityEnrollmentInput) {
    return this.enrollSecurityService.executeEnroll(body);
  }
}