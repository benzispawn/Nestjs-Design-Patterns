import { AxiosError } from 'axios';
import { SecurityEnrollmentAlreadyExistsError } from './errors/security-enrollment-already-exists.error';
import { SecurityEnrollmentUnavailableError } from './errors/security-enrollment-unavailable.error';
import { SecurityEnrollmentUnexpectedError } from './errors/security-enrollment-unexpected.error';

type ProviderErrorBody = {
  semCode?: string;
  message?: string;
};                                                                                                                                                                                                                                                                                                                                                                                             

export function mapSecurityEnrollmentError(error: unknown): Error {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const data = error.response?.data as ProviderErrorBody | undefined;
        const semCode = data?.semCode;

        if (semCode === 'SEM-300') {
            return new SecurityEnrollmentAlreadyExistsError(
                data?.message ?? 'Security enrollment already exists',
            );
        }

        if (status === 408 || status === 504 || error.code === 'ECONNABORTED') {
            return new SecurityEnrollmentUnavailableError('Security enrollment timeout');
        }

        if (status && status >= 500) {
            return new SecurityEnrollmentUnavailableError('Security enrollment provider unavailable');
        }

        return new SecurityEnrollmentUnexpectedError(
            data?.message ?? 'Unexpected error returned by security enrollment provider',
        );
    }
    return new SecurityEnrollmentUnexpectedError();
}