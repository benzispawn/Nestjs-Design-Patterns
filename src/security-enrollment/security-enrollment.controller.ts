import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SecurityEnrollmentService } from "./security-enrollment.service";
import type { SecurityEnrollmentInput } from "./security-enrollment.gateway";


@Controller('security-enrollment')
export class SecurityEnrollmentController {
  constructor(
    private readonly enrollSecurityService: SecurityEnrollmentService,
  ) {}

  @Post()
  @HttpCode(200)
  async enroll(@Body() body: SecurityEnrollmentInput) {
    return this.enrollSecurityService.executeEnroll(body);
  }
}