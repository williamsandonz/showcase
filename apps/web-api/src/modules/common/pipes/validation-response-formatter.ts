import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationResponseFormatterPipe implements PipeTransform<any> {
  constructor() {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await (await validate(object)).map((error: ValidationError) => {
      return this.mapValidationError(error);
    });
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private mapValidationError(error: ValidationError) {
    const response: any = {
      property: error.property,
      constraints: error.constraints,
    };
    if (error.children) {
      response.children = error.children.map((childError: ValidationError) => {
        return this.mapValidationError(childError);
      });
    }
    return response;
  }
}
