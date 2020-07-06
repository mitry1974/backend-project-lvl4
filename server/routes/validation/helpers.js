import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import ValidationError from '../../errors/ValidationError';

export default async function validateData({
  ClassToValidate, objectToValidate, url, flashMessage,
}) {
  const formData = plainToClass(ClassToValidate, objectToValidate);
  const errors = await validate(formData);
  if (errors.length !== 0) {
    throw new ValidationError({
      url,
      message: `Validating ${JSON.stringify(formData)}, errors: ${JSON.stringify(errors)}}`,
      formData,
      errors,
      flashMessage,
    });
  }
  return true;
}
