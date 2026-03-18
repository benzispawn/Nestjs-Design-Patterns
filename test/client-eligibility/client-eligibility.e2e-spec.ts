import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { EligibilityModule } from "../../src/client-eligibility/client-eligibility.module";
import { EligibilityRepository } from "../../src/client-eligibility/repositories/eligibility.repository";

describe("Client Eligibility (e2e)", () => {
    let app: INestApplication;
    let repository: EligibilityRepository;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [EligibilityModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.use((req, _res, next) => {
            const userIdHeader = req.headers["x-user-id"];
            const tenantIdHeader = req.headers["x-tenant-id"];

            const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
            const tenantId = Array.isArray(tenantIdHeader) ? tenantIdHeader[0] : tenantIdHeader;

            (req as any).user = {
                id: userId ?? "e2e-user-default",
                ...(tenantId ? { tenantId } : {}),
            };

            next();
        });

        await app.init();

        repository = moduleFixture.get<EligibilityRepository>(EligibilityRepository);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should handle simultaneous calls for the same user and evaluate only once", async () => {
        const evaluateSpy = jest.spyOn(repository, "evaluate");

        const [screenA, screenB, screenC] = await Promise.all([
            request(app.getHttpServer()).get("/screen-a").set("x-user-id", "same-user-2"),
            request(app.getHttpServer()).get("/screen-b").set("x-user-id", "same-user-2"),
            request(app.getHttpServer()).get("/screen-c").set("x-user-id", "same-user-2"),
        ]);

        expect(screenA.status).toBe(200);
        expect(screenB.status).toBe(200);
        expect(screenC.status).toBe(200);

        expect(screenA.body.screen).toBe("A");
        expect(screenB.body.screen).toBe("B");
        expect(screenC.body.screen).toBe("C");

        expect(evaluateSpy).toHaveBeenCalledTimes(1);

        const cachedFollowUp = await request(app.getHttpServer())
            .get("/screen-a")
            .set("x-user-id", "same-user-2");

        expect(cachedFollowUp.status).toBe(200);
        expect(evaluateSpy).toHaveBeenCalledTimes(1);
    });

    it("should evaluate once per user for simultaneous calls with different users", async () => {
        const evaluateSpy = jest.spyOn(repository, "evaluate");

        const [screenA, screenB, screenC] = await Promise.all([
            request(app.getHttpServer()).get("/screen-a").set("x-user-id", "user-2"),
            request(app.getHttpServer()).get("/screen-b").set("x-user-id", "user-4"),
            request(app.getHttpServer()).get("/screen-c").set("x-user-id", "user-6"),
        ]);

        expect(screenA.status).toBe(200);
        expect(screenB.status).toBe(200);
        expect(screenC.status).toBe(200);

        expect(evaluateSpy).toHaveBeenCalledTimes(3);
    });
});
