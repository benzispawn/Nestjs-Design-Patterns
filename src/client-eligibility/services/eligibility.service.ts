import { Injectable } from "@nestjs/common";
import { InMemoryEligibilitySingleFlightProvider } from "../providers/in-memory-eligibility-single-flight.provider";
import { EligibilityModel } from "../model/eligibility.model";

@Injectable()
export class EligibilityService {
    constructor(
        private readonly inMemoryEligibilityProvider: InMemoryEligibilitySingleFlightProvider
    ) {}

    async getEligibilityForuser(
        userId: string,
        tenantId?: string,
    ): Promise<EligibilityModel> {
        return this.inMemoryEligibilityProvider.getEligibility({ userId, tenantId });
    }
}