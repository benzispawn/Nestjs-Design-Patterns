import { Injectable } from "@nestjs/common";
import { EligibilityModel } from "../model/eligibility.model";
import { EligibilityRepository } from "../repositories/eligibility.repository";
import { EligibilityDto } from "../model/eligibility.dto";

@Injectable()
export class InMemoryEligibilitySingleFlightProvider {
    private readonly inflight = new Map<string, Promise<EligibilityModel>>();
    private readonly cache = new Map<string, { expiresAt: number, data: EligibilityModel }>();

    constructor(
        private readonly eligibilityRepository: EligibilityRepository,
    ) {}

    async getEligibility(context: EligibilityDto): Promise<EligibilityModel> {
        const key = context.userId;
        const now = Date.now();

        const cached = this.cache.get(key);
        if (cached && cached.expiresAt > now) {
            return cached.data;
        }

        const existing = this.inflight.get(key);
        if (existing) {
            return existing;
        }

        const promise = this.eligibilityRepository.evaluate(context)
            .then((result) => {
                this.cache.set(key, {
                data: result,
                expiresAt: Date.now() + 10_000,
                });
                return result;
            })
            .finally(() => {
                this.inflight.delete(key);
            });

        this.inflight.set(key, promise);

        return promise;
    }

}