import { Module } from "@nestjs/common";
import { EligibilityController } from "./client-eligibility.controller";
import { InMemoryEligibilitySingleFlightProvider } from "./providers/in-memory-eligibility-single-flight.provider";
import { EligibilityRepository } from "./repositories/eligibility.repository";
import { EligibilityService } from "./services/eligibility.service";

@Module({
    controllers: [EligibilityController],
    providers: [
        InMemoryEligibilitySingleFlightProvider,
        EligibilityRepository,
        EligibilityService
    ],
    exports: [EligibilityService]
})
export class EligibilityModule {}