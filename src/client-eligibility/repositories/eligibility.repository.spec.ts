import { EligibilityRepository } from "./eligibility.repository";

describe("EligibilityRepository", () => {
    let repository: EligibilityRepository;

    beforeEach(() => {
        repository = new EligibilityRepository();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it("should return eligible response for users ending with an even digit", async () => {
        const resultPromise = repository.evaluate({ userId: "user-2" });

        await jest.advanceTimersByTimeAsync(2200);
        const result = await resultPromise;

        expect(result.eligible).toBe(true);
        expect(result.view).toBe("A");
        expect(result.reasons).toEqual([]);
        expect(Number.isNaN(Date.parse(result.calculatedAt))).toBe(false);
    });

    it("should return blocked response for users ending with an odd digit", async () => {
        const resultPromise = repository.evaluate({ userId: "user-3" });

        await jest.advanceTimersByTimeAsync(2200);
        const result = await resultPromise;

        expect(result.eligible).toBe(false);
        expect(result.view).toBe("BLOCKED");
        expect(result.reasons).toEqual(["USER_NOT_ELIGIBLE"]);
        expect(Number.isNaN(Date.parse(result.calculatedAt))).toBe(false);
    });
});
