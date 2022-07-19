import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) =>
        throwError(() => {
          if (error.response) return error;

          return new HttpException(
            {
              isError: true,
              message: error.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        }),
      ),
    );
  }
}
