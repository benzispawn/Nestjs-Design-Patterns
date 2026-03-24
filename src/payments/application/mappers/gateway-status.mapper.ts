import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export class GatewayStatusMapper {
  static toDomain(
    gatewayStatus: 'approved' | 'failed' | 'pending',
  ): PaymentStatus {
    switch (gatewayStatus) {
      case 'approved':
        return PaymentStatus.APPROVED;
      case 'pending':
        return PaymentStatus.PENDING;
      case 'failed':
        return PaymentStatus.FAILED;
      default:
        throw new Error(`Unknown gateway status: ${String(gatewayStatus)}`);
    }
  }
}
