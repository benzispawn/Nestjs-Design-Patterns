import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { SecurityEnrollmentAlreadyExistsError } from "./security-enrollment-already-exists.error";
import { SecurityEnrollmentUnavailableError } from "./security-enrollment-unavailable.error";
import { Request, Response } from 'express';

@Catch(
    SecurityEnrollmentAlreadyExistsError,
    SecurityEnrollmentUnavailableError,
)
export class SecurityEnrollmentExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        if (exception instanceof SecurityEnrollmentAlreadyExistsError) {
        return response.status(409).json({
            code: 'SECURITY_ENROLLMENT_ALREADY_EXISTS',
            message: exception.message,
        });
        }

        if (exception instanceof SecurityEnrollmentUnavailableError) {
        return response.status(503).json({
            code: 'SECURITY_ENROLLMENT_UNAVAILABLE',
            message: exception.message,
        });
        }

        return response.status(500).json({
            code: 'INTERNAL_ERROR',
            message: 'Unexpected error',
        });
    }
}