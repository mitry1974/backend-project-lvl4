import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import ValidationError from '../../errors/ValidationError';

export default async function validateAndProcessErrors({
  ClassToValidate, objectToValidate, renderData,
}) {
  const formData = plainToClass(ClassToValidate, objectToValidate);
  const rawErrors = await validate(formData);
  if (rawErrors.length !== 0) {
    const errors = {};
    rawErrors.forEach((error) => {
      errors[error.property] = Object.values(error.constraints).join(', ');
    });
    throw new ValidationError({
      message: `Validating ${JSON.stringify(formData)}, errors: ${JSON.stringify(errors)}}`,
      errors,
      renderData,
    });
  }
  return true;
}
