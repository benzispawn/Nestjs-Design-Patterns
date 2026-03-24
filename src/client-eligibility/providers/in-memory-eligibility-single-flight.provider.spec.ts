import { InMemoryEligibilitySingleFlightProvider } from './in-memory-eligibility-single-flight.provider';

import type { EligibilityModel } from '../model/eligibility.model';
import type { EligibilityRepository } from '../repositories/eligibility.repository';

describe('InMemoryEligibilitySingleFlightProvider', () => {
  let provider: InMemoryEligibilitySingleFlightProvider;
  let repositoryMock: { evaluate: jest.Mock };

  const baseEligibility: EligibilityModel = {
    eligible: true,
    view: 'A',
    reasons: [],
    calculatedAt: '2026-03-17T00:00:00.000Z',
  };

  beforeEach(() => {
    repositoryMock = {
      evaluate: jest.fn(),
    };

    provider = new InMemoryEligibilitySingleFlightProvider(
      repositoryMock as unknown as EligibilityRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return cached data for the same user inside TTL', async () => {
    repositoryMock.evaluate.mockResolvedValue(baseEligibility);

    const context = { userId: 'user-1' };

    const first = await provider.getEligibility(context);
    const second = await provider.getEligibility(context);

    expect(first).toEqual(baseEligibility);
    expect(second).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(1);
  });

  it('should deduplicate concurrent calls for the same user', async () => {
    let resolveEvaluate: ((value: EligibilityModel) => void) | undefined;
    const deferred = new Promise<EligibilityModel>((resolve) => {
      resolveEvaluate = resolve;
    });

    repositoryMock.evaluate.mockReturnValue(deferred);

    const context = { userId: 'user-42' };
    const firstPromise = provider.getEligibility(context);
    const secondPromise = provider.getEligibility(context);

    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(1);

    resolveEvaluate?.(baseEligibility);

    const [first, second] = await Promise.all([firstPromise, secondPromise]);

    expect(first).toEqual(baseEligibility);
    expect(second).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(1);
  });

  it('should evaluate independently for different users', async () => {
    const firstEligibility: EligibilityModel = {
      ...baseEligibility,
      calculatedAt: '2026-03-17T00:00:01.000Z',
    };
    const secondEligibility: EligibilityModel = {
      ...baseEligibility,
      view: 'B',
      calculatedAt: '2026-03-17T00:00:02.000Z',
    };

    repositoryMock.evaluate
      .mockResolvedValueOnce(firstEligibility)
      .mockResolvedValueOnce(secondEligibility);

    const [first, second] = await Promise.all([
      provider.getEligibility({ userId: 'user-A' }),
      provider.getEligibility({ userId: 'user-B' }),
    ]);

    expect(first).toEqual(firstEligibility);
    expect(second).toEqual(secondEligibility);
    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(2);
    expect(repositoryMock.evaluate).toHaveBeenNthCalledWith(1, {
      userId: 'user-A',
    });
    expect(repositoryMock.evaluate).toHaveBeenNthCalledWith(2, {
      userId: 'user-B',
    });
  });

  it('should clear inflight on rejection and allow a retry', async () => {
    const error = new Error('repository failure');

    repositoryMock.evaluate.mockRejectedValueOnce(error);

    await expect(
      provider.getEligibility({ userId: 'user-retry' }),
    ).rejects.toThrow('repository failure');

    repositoryMock.evaluate.mockResolvedValueOnce(baseEligibility);

    const retried = await provider.getEligibility({ userId: 'user-retry' });

    expect(retried).toEqual(baseEligibility);
    expect(repositoryMock.evaluate).toHaveBeenCalledTimes(2);
  });
});
