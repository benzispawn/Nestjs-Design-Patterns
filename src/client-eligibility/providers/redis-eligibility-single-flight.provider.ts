import { Injectable, Logger } from "@nestjs/common";
import { EligibilityRepository } from "../repositories/eligibility.repository";
import { EligibilityModel } from "../model/eligibility.model";
import { EligibilityDto } from "../model/eligibility.dto";
import { EligibilitySingleFlightProvider } from "./eligibility-single-flight.provider";
import { RedisConnector } from "../../shared/infra/redis/redis.connector";

@Injectable()
export class RedisEligibilitySingleFlightProvider implements EligibilitySingleFlightProvider {
    private readonly logger = new Logger(RedisEligibilitySingleFlightProvider.name);
    private readonly ttlSeconds = Number(process.env.ELIGIBILITY_CACHE_TTL_SECONDS ?? "10");
    private readonly lockTtlMs = Number(process.env.ELIGIBILITY_LOCK_TTL_MS ?? "5000");
    private readonly lockWaitTimeoutMs = Number(process.env.ELIGIBILITY_LOCK_WAIT_TIMEOUT_MS ?? "7000");
    private readonly lockPollMs = Number(process.env.ELIGIBILITY_LOCK_POLL_MS ?? "100");

    constructor(
        private readonly eligibilityRepository: EligibilityRepository,
        private readonly redisConnector: RedisConnector,
    ) {}

    async getEligibility(context: EligibilityDto): Promise<EligibilityModel> {
        const key = context.userId;
        const cacheKey = this.cacheKey(key);
        const lockKey = this.lockKey(key);

        const redis = await this.redisConnector.getClient();
        const cachedRaw = await redis.get(cacheKey);
        if (cachedRaw) {
            return JSON.parse(cachedRaw) as EligibilityModel;
        }

        const lockValue = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const lockAcquired = await redis.set(lockKey, lockValue, {
            NX: true,
            PX: this.lockTtlMs,
        });

        if (lockAcquired) {
            try {
                const result = await this.eligibilityRepository.evaluate(context);
                await redis.set(cacheKey, JSON.stringify(result), { EX: this.ttlSeconds });
                return result;
            } finally {
                const currentLockValue = await redis.get(lockKey);
                if (currentLockValue === lockValue) {
                    await redis.del(lockKey);
                }
            }
        }

        const deadline = Date.now() + this.lockWaitTimeoutMs;
        while (Date.now() < deadline) {
            const waitedRaw = await redis.get(cacheKey);
            if (waitedRaw) {
                return JSON.parse(waitedRaw) as EligibilityModel;
            }

            await this.sleep(this.lockPollMs);
        }

        this.logger.warn(`Lock wait timeout for user=${key}, executing fallback evaluation`);

        const result = await this.eligibilityRepository.evaluate(context);
        await redis.set(cacheKey, JSON.stringify(result), { EX: this.ttlSeconds });
        return result;
    }

    private cacheKey(userId: string): string {
        return `eligibility:${userId}`;
    }

    private lockKey(userId: string): string {
        return `eligibility:lock:${userId}`;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
