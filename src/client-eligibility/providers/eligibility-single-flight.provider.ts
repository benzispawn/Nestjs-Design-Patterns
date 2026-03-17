import { EligibilityDto } from "../model/eligibility.dto";
import { EligibilityModel } from "../model/eligibility.model";

export interface EligibilitySingleFlightProvider {
    getEligibility(context: EligibilityDto): Promise<EligibilityModel>;
}
