import { EligibilityService } from "./eligibility.service";
import { EligibilityModel } from "../model/eligibility.model";
import { EligibilitySingleFlightProvider } from "../providers/eligibility-single-flight.provider";

describe("EligibilityService", () => {
    let service: EligibilityService;
    let providerMock: { getEligibility: jest.Mock };

    beforeEach(() => {
        providerMock = {
            getEligibility: jest.fn(),
        };

        service = new EligibilityService(
            providerMock as unknown as EligibilitySingleFlightProvider,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delegate with userId and tenantId", async () => {
        const expected: EligibilityModel = {
            eligible: true,
            view: "A",
            reasons: [],
            calculatedAt: "2026-03-17T00:00:00.000Z",
        };

        providerMock.getEligibility.mockResolvedValue(expected);

        const result = await service.getEligibilityForuser("user-10", "tenant-1");

        expect(providerMock.getEligibility).toHaveBeenCalledTimes(1);
        expect(providerMock.getEligibility).toHaveBeenCalledWith({
            userId: "user-10",
            tenantId: "tenant-1",
        });
        expect(result).toEqual(expected);
    });

    it("should delegate without tenantId", async () => {
        const expected: EligibilityModel = {
            eligible: false,
            view: "BLOCKED",
            reasons: ["USER_NOT_ELIGIBLE"],
            calculatedAt: "2026-03-17T00:00:00.000Z",
        };

        providerMock.getEligibility.mockResolvedValue(expected);

        const result = await service.getEligibilityForuser("user-11");

        expect(providerMock.getEligibility).toHaveBeenCalledTimes(1);
        expect(providerMock.getEligibility).toHaveBeenCalledWith({
            userId: "user-11",
            tenantId: undefined,
        });
        expect(result).toEqual(expected);
    });
});
