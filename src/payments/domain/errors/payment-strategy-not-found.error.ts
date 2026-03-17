import { PaymentMethod } from "../enums/payment-mehtod.enum";

export class PaymentStrategyNotFoundError extends Error {
    constructor(method: PaymentMethod) {
        super(`Payment strategy not found for method ${String(method)}`);
        this.name = "PaymentStrategyNotFoundError";
    }
}