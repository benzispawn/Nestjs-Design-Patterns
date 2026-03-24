import type { EligibilityDto } from '../model/eligibility.dto';
import type { EligibilityModel } from '../model/eligibility.model';

export interface EligibilitySingleFlightProvider {
  getEligibility(context: EligibilityDto): Promise<EligibilityModel>;
}
