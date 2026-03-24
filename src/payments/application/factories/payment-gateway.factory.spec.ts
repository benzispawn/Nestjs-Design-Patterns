import { Test } from '@nestjs/testing';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { PaymentGatewayFactory } from './payment-gateway.factory';

import type { FakeMercadoPagoAdapter } from '../../infra/gateways/adapters/fake-mercado-pago.adapter';
import type { FakeStripeAdapter } from '../../infra/gateways/adapters/fake-stripe.adapter';

describe('PaymentGatewayFactory', () => {
  let factory: PaymentGatewayFactory;

  const mercadoPagoGatewayMock = {
    provider: PaymentProvider.MERCADO_PAGO,
    charge: jest.fn(),
  } as unknown as FakeMercadoPagoAdapter;

  const stripeGatewayMock = {
    provider: PaymentProvider.STRIPE,
    charge: jest.fn(),
  } as unknown as FakeStripeAdapter;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PaymentGatewayFactory,
          useFactory: () =>
            new PaymentGatewayFactory(
              mercadoPagoGatewayMock,
              stripeGatewayMock,
            ),
        },
      ],
    }).compile();

    factory = moduleRef.get<PaymentGatewayFactory>(PaymentGatewayFactory);
  });

  it('should return stripe adapter', () => {
    const gateway = factory.create(PaymentProvider.STRIPE);

    expect(gateway).toBe(stripeGatewayMock);
  });

  it('should return mercado pago adapter', () => {
    const gateway = factory.create(PaymentProvider.MERCADO_PAGO);

    expect(gateway).toBe(mercadoPagoGatewayMock);
  });

  it('should throw an error', () => {
    expect(() =>
      factory.create(undefined as unknown as PaymentProvider),
    ).toThrow('Unsupported payment provider');
  });
});
