import { HttpException, HttpStatus } from '@nestjs/common';

export function handleNotFoundException(
  object: any,
  objectTitle: string,
): void {
  if (!object || object.deletedAt) {
    throw new HttpException(
      {
        isError: true,
        message: `${objectTitle} not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
