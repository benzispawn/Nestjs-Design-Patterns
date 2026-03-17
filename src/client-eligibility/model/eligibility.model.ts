export type EligibilityModel = {
    eligible: boolean;
    view: 'A' | 'B' | 'C' | 'BLOCKED';
    reasons: string[];
    calculatedAt: string;
}