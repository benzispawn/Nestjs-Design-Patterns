import { RedisEligibilitySingleFlightProvider } from './redis-eligibility-single-flight.provider';

import type {
  RedisClientLike,
  RedisConnector,
} from '../../shared/infra/redis/redis.connector';
import type { EligibilityModel } from '../model/eligibility.model';
import type { EligibilityRepository } from '../repositories/eligibility.repository';

function createAsyncMockResolver<TArgs extends unknown[], TReturn>(
  logic: (...args: TArgs) => TReturn,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    return new Promise<TReturn>((resolve) => {
      resolve(logic(...args));
    });
  };
}

describe('RedisEligibilitySingleFlightProvider', () => {
  let provider: RedisEligibilitySingleFlightProvider;
  let repositoryMock: { evaluate: jest.Mock };
  let redisConnectorMock: { getClient: jest.Mock };
  let redisClientMock: jest.Mocked<RedisClientLike>;

  const baseEligibility: EligibilityModel = {
    eligible: true,
    view: 'A',
    reasons: [],
    calculatedAt: '2026-03-17T00:00:00.000Z',
  };

  const originalEnv = { ...process.env };

  const mockRedisClientSetMock = jest.fn();
  const mockRedisClientDelMock = jest.fn();

  beforeEach(() => {
    process.env.ELIGIBILITY_CACHE_TTL_SECONDS = '10';
    process.env.ELIGIBILITY_LOCK_TTL_MS = '5000';
    process.env.ELIGIBILITY_LOCK_WAIT_TIMEOUT_MS = '50';
    process.env.ELIGIBILITY_LOCK_POLL_MS = '1';

    repositoryMock = {
      evaluate: jest.fn(),
    };

    redisClientMock = {
      connect: jest.fn(),
      quit: jest.fn(),
      get: jest.fn(),
      set: mockRedisClientSetMock,
      del: mockRedisClientDelMock,
    };

    redisConnectorMock = {
      getClient: jest.fn().mockResolvedValue(redisClientMock),
    };

    provider = new RedisEligibilitySingleFlightProvider(
      repositoryMock as unknown as EligibilityRepository,
      redisConnectorMock as unknown as RedisConnector,
    );
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  it('should return cached value when present in Redis', async () => {
    redisClientMock.get.mockResolvedValue(JSON.stringify(baseEligibility));

    const result = await provider.getEligibility({ userId: 'user-1' });

    expect(result).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).not.toHaveBeenCalled();
    expect(mockRedisClientSetMock).not.toHaveBeenCalled();
  });

  it('should evaluate and cache when lock is acquired', async () => {
    let currentLockValue = '';

    redisClientMock.get.mockImplementation(
      createAsyncMockResolver((key) => {
        if (key === 'eligibility:user-2') {
          return null;
        }
        if (key === 'eligibility:lock:user-2') {
          return currentLockValue;
        }
        return null;
      }),
    );

    redisClientMock.set.mockImplementation(
      createAsyncMockResolver(
        (
          key: string,
          value: string,
          options?: { EX?: number; PX?: number; NX?: boolean },
        ) => {
          if (key === 'eligibility:lock:user-2' && options?.NX) {
            currentLockValue = value;
            return 'OK';
          }

          if (key === 'eligibility:user-2' && options?.EX === 10) {
            return 'OK';
          }

          return null;
        },
      ),
    );

    redisClientMock.del.mockResolvedValue(1);
    repositoryMock.evaluate.mockResolvedValue(baseEligibility);

    const result = await provider.getEligibility({ userId: 'user-2' });

    expect(result).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(1);
    expect(mockRedisClientDelMock).toHaveBeenCalledWith(
      'eligibility:lock:user-2',
    );
  });

  it('should wait for cache if lock is already held', async () => {
    redisClientMock.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(baseEligibility));
    redisClientMock.set.mockResolvedValueOnce(null);

    const result = await provider.getEligibility({ userId: 'user-3' });

    expect(result).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).not.toHaveBeenCalled();
  });
});
