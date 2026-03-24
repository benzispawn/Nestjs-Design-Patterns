import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { mapSecurityEnrollmentError } from './security-enrollment-error.mapper';

export interface SecurityEnrollmentGateway {
  enroll(input: SecurityEnrollmentInput): Promise<SecurityEnrollmentResult>;
}

export interface SecurityEnrollmentInput {
  userId: string;
  deviceInfo: string;
}

export interface SecurityEnrollmentResult {
  enrollmentId: string;
  status: string;
}

interface RequestEnrollResponse {
  status: string;
  userId;
}

@Injectable()
export class HttpSecurityEnrollmentGateway implements SecurityEnrollmentGateway {
  constructor(private readonly httpService: HttpService) {}

  async enroll(
    input: SecurityEnrollmentInput,
  ): Promise<SecurityEnrollmentResult> {
    try {
      const { data } = await firstValueFrom<{ data: RequestEnrollResponse }>(
        this.httpService.post(
          'https://external-enrollment-service.com/api/enroll',
          {
            userId: input.userId,
            deviceInfo: input.deviceInfo,
          },
        ),
      );
      return {
        enrollmentId: 'enroll_' + data.userId,
        status: data.status,
      };
    } catch (error) {
      throw mapSecurityEnrollmentError(error);
    }
  }
}
