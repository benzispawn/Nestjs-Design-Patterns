import { Module } from '@nestjs/common';

import { RedisConnector } from '../shared/infra/redis/redis.connector';

import { EligibilityController } from './client-eligibility.controller';
import { ELIGIBILITY_SINGLE_FLIGHT_PROVIDER } from './providers/eligibility-single-flight.tokens';
import { InMemoryEligibilitySingleFlightProvider } from './providers/in-memory-eligibility-single-flight.provider';
import { RedisEligibilitySingleFlightProvider } from './providers/redis-eligibility-single-flight.provider';
import { EligibilityRepository } from './repositories/eligibility.repository';
import { EligibilityService } from './services/eligibility.service';

type EligibilityProviderStrategy = 'memory' | 'redis';

// Manual switch for now. Change to "redis" when Redis is up and configured.
const ELIGIBILITY_PROVIDER_STRATEGY: EligibilityProviderStrategy = 'memory';

@Module({
  controllers: [EligibilityController],
  providers: [
    InMemoryEligibilitySingleFlightProvider,
    RedisEligibilitySingleFlightProvider,
    RedisConnector,
    EligibilityRepository,
    {
      provide: ELIGIBILITY_SINGLE_FLIGHT_PROVIDER,
      useFactory: (
        inMemoryProvider: InMemoryEligibilitySingleFlightProvider,
        redisProvider: RedisEligibilitySingleFlightProvider,
      ) => {
        return ELIGIBILITY_PROVIDER_STRATEGY === 'redis'
          ? redisProvider
          : inMemoryProvider;
      },
      inject: [
        InMemoryEligibilitySingleFlightProvider,
        RedisEligibilitySingleFlightProvider,
      ],
    },
    EligibilityService,
  ],
  exports: [EligibilityService],
})
export class EligibilityModule {}
