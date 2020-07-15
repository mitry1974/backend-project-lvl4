import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import ValidationError from '../../errors/ValidationError';

export default async function validateAndProcessErrors({
  ClassToValidate, objectToValidate, renderData,
}) {
  const formData = plainToClass(ClassToValidate, objectToValidate);
  const errors = await validate(formData);
  if (errors.length !== 0) {
    throw new ValidationError({
      message: `Validating ${JSON.stringify(formData)}, errors: ${JSON.stringify(errors)}}`,
      errors,
      renderData,
    });
  }
  return true;
}
