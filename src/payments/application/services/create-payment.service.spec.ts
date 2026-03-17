import { Test } from "@nestjs/testing";
import { CreatePaymentService } from "./create-payment.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PaymentStrategyFactory } from "../factories/payment-strategy.factory";
import { PaymentStatus } from "../../domain/enums/payment-status.enum";
import { PaymentMethod } from "../../domain/enums/payment-mehtod.enum";
import { PaymentProvider } from "../../domain/enums/payment-provider.enum";

describe('CreatePaymentService', () => {
    let service: CreatePaymentService;

    const strategyMock = {
        supports: jest.fn(),
        execute: jest.fn(),
    };

    const strategyFactoryMock = {
        create: jest.fn().mockReturnValue(strategyMock),
    };

    const paymentRepositoryMock = {
        save: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
    };

    const eventEmitterMock = {
        emit: jest.fn(),
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreatePaymentService,
                {
                    provide: PaymentStrategyFactory,
                    useValue: strategyFactoryMock,
                },
                {
                    provide: 'PaymentRepository',
                    useValue: paymentRepositoryMock,
                },
                {
                    provide: EventEmitter2,
                    useValue: eventEmitterMock,
                }
            ],
        }).compile();

        service = moduleRef.get<CreatePaymentService>(CreatePaymentService);

        jest.clearAllMocks();
    });

    it('should create a payment a payment', async () => {
        strategyMock.execute.mockResolvedValue({
            status: PaymentStatus.APPROVED,
            externalId: 'ext-123',
        });

        const result = await service.execute({
            amount: 150,
            customerId: 'cust-123',
            method: PaymentMethod.PIX,
            provider: PaymentProvider.STRIPE,
        });

        expect(strategyFactoryMock.create).toHaveBeenCalledWith(PaymentMethod.PIX);
        expect(strategyMock.execute).toHaveBeenCalledWith({
            amount: 150,
            customerId: 'cust-123',
            provider: PaymentProvider.STRIPE,
        });
        expect(paymentRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(eventEmitterMock.emit).toHaveBeenCalledWith(
            'payment.created',
            expect.objectContaining({
                customerId: 'cust-123',
                amount: 150,
                method: PaymentMethod.PIX,
                provider: PaymentProvider.STRIPE,
                status: PaymentStatus.APPROVED,
            }),
        );
        expect(result).toEqual(
            expect.objectContaining({
                customerId: 'cust-123',
                amount: 150,
                method: PaymentMethod.PIX,
                provider: PaymentProvider.STRIPE,
                status: PaymentStatus.APPROVED,
                externalId: 'ext-123',
            }),
        );
    })
});