import { EligibilityController } from "./client-eligibility.controller";
import { EligibilityService } from "./services/eligibility.service";
import { EligibilityModel } from "./model/eligibility.model";

describe("EligibilityController", () => {
    let controller: EligibilityController;
    let eligibilityServiceMock: { getEligibilityForuser: jest.Mock };

    const eligibility: EligibilityModel = {
        eligible: true,
        view: "A",
        reasons: [],
        calculatedAt: "2026-03-17T00:00:00.000Z",
    };

    beforeEach(() => {
        eligibilityServiceMock = {
            getEligibilityForuser: jest.fn().mockResolvedValue(eligibility),
        };

        controller = new EligibilityController(
            eligibilityServiceMock as unknown as EligibilityService,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return screen A eligibility", async () => {
        const req = {
            user: {
                id: "user-1",
                tenantId: "tenant-1",
            },
        };

        const result = await controller.getScreenA(req as any);

        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledTimes(1);
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledWith(
            "user-1",
            "tenant-1",
        );
        expect(result).toEqual({
            screen: "A",
            eligbility: eligibility,
        });
    });

    it("should return screen B eligibility", async () => {
        const req = {
            user: {
                id: "user-2",
                tenantId: "tenant-2",
            },
        };

        const result = await controller.getScreenB(req as any);

        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledTimes(1);
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledWith(
            "user-2",
            "tenant-2",
        );
        expect(result).toEqual({
            screen: "B",
            eligbility: eligibility,
        });
    });

    it("should return screen C eligibility", async () => {
        const req = {
            user: {
                id: "user-3",
                tenantId: "tenant-3",
            },
        };

        const result = await controller.getScreenC(req as any);

        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledTimes(1);
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledWith(
            "user-3",
            "tenant-3",
        );
        expect(result).toEqual({
            screen: "C",
            eligbility: eligibility,
        });
    });

    it("should handle simultaneous calls for the same user", async () => {
        const sameUserReq = {
            user: {
                id: "user-99",
                tenantId: "tenant-99",
            },
        };

        const [screenAResult, screenBResult] = await Promise.all([
            controller.getScreenA(sameUserReq as any),
            controller.getScreenB(sameUserReq as any),
        ]);

        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledTimes(2);
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenNthCalledWith(
            1,
            "user-99",
            "tenant-99",
        );
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenNthCalledWith(
            2,
            "user-99",
            "tenant-99",
        );
        expect(screenAResult).toEqual({
            screen: "A",
            eligbility: eligibility,
        });
        expect(screenBResult).toEqual({
            screen: "B",
            eligbility: eligibility,
        });
    });

    it("should handle simultaneous calls for different users", async () => {
        const userOneReq = {
            user: {
                id: "user-1",
                tenantId: "tenant-1",
            },
        };
        const userTwoReq = {
            user: {
                id: "user-2",
                tenantId: "tenant-2",
            },
        };

        const [screenAResult, screenCResult] = await Promise.all([
            controller.getScreenA(userOneReq as any),
            controller.getScreenC(userTwoReq as any),
        ]);

        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenCalledTimes(2);
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenNthCalledWith(
            1,
            "user-1",
            "tenant-1",
        );
        expect(eligibilityServiceMock.getEligibilityForuser).toHaveBeenNthCalledWith(
            2,
            "user-2",
            "tenant-2",
        );
        expect(screenAResult).toEqual({
            screen: "A",
            eligbility: eligibility,
        });
        expect(screenCResult).toEqual({
            screen: "C",
            eligbility: eligibility,
        });
    });
});
