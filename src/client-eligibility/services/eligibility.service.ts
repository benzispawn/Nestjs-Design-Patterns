import { Inject, Injectable } from "@nestjs/common";
import { EligibilityModel } from "../model/eligibility.model";
import { EligibilitySingleFlightProvider } from "../providers/eligibility-single-flight.provider";
import { ELIGIBILITY_SINGLE_FLIGHT_PROVIDER } from "../providers/eligibility-single-flight.tokens";

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
