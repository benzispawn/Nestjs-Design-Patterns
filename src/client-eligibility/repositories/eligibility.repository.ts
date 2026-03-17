import { Injectable, Logger } from "@nestjs/common";
import { EligibilityModel } from "../model/eligibility.model";
import { EligibilityDto } from "../model/eligibility.dto";

@Injectable()
export class EligibilityRepository {
    private readonly logger = new Logger(EligibilityRepository.name);

    async evaluate(context: EligibilityDto): Promise<EligibilityModel> {
        this.logger.log(`Evaluating eligibility for user=${context.userId}`);

        await new Promise((resolve) => setTimeout(resolve, 2200));

        const eligible = Number(context.userId.slice(-1)) % 2 === 0;// Just a play to get one eligible user

        return {
            eligible,
            view: eligible ? 'A' : 'BLOCKED',
            reasons: eligible ? [] : ['USER_NOT_ELIGIBLE'],
            calculatedAt: new Date().toISOString(),
        }
    }
}