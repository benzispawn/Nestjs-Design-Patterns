import { Injectable } from "@nestjs/common";
import { HttpSecurityEnrollmentGateway, SecurityEnrollmentInput } from "./security-enrollment.gateway";

@Injectable()
export class SecurityEnrollmentService {
    constructor(private readonly securityEnrollmentGateway: HttpSecurityEnrollmentGateway) {}
  executeEnroll(input: SecurityEnrollmentInput) {
    return this.securityEnrollmentGateway.enroll(input);
  }
}