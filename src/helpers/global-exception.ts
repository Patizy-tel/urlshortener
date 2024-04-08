import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { MongooseError } from 'mongoose';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error('🚀 GLOBAL EXCEPTION', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof MongooseError) {
      this.logger.error('Mongoose Error:', exception.message);
      this.handleMongooseError(exception, response, request);
    } else if (
      exception?.response?.message &&
      exception?.response?.statusCode
    ) {
      this.handleHttpException(exception, response, request);
    } else {
      this.handleUnknownError(exception, response, request);
    }
  }

  private handleMongooseError(
    exception: MongooseError,
    response: any,
    request: any,
  ) {
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleHttpException(exception: any, response: any, request: any) {
    const statusCode = exception?.response?.statusCode;
    const message = exception?.response?.message;
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleUnknownError(exception: any, response: any, request: any) {
    let statusCode =
      exception?.status ||
      exception?.statusCode ||
      exception?.error?.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception?.status === 'error') {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const message =
      exception?.response?.message ||
      exception?.message ||
      exception?.error?.message ||
      exception;
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
