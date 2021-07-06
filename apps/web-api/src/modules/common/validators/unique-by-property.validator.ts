import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ name: 'uniqueByProperty', async: true })
export class UniqueByPropertyValidator implements ValidatorConstraintInterface {
  constructor(
  ) {
  }
  async validate(text: string, args: ValidationArguments): Promise<boolean> {
    const entity = await getManager().findOne(args.constraints[0], {
      where: {
        [args.constraints[1]]: args.value,
      },
    });
    return Promise.resolve(!entity);
  }
}
