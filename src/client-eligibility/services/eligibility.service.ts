import { Inject, Injectable } from '@nestjs/common';

import { ELIGIBILITY_SINGLE_FLIGHT_PROVIDER } from '../providers/eligibility-single-flight.tokens';

import type { EligibilityModel } from '../model/eligibility.model';
import type { EligibilitySingleFlightProvider } from '../providers/eligibility-single-flight.provider';

@Injectable()
export class EligibilityService {
  constructor(
    @Inject(ELIGIBILITY_SINGLE_FLIGHT_PROVIDER)
    private readonly eligibilityProvider: EligibilitySingleFlightProvider,
  ) {}

  async getEligibilityForuser(
    userId: string,
    tenantId?: string,
  ): Promise<EligibilityModel> {
    return this.eligibilityProvider.getEligibility({ userId, tenantId });
  }
}
