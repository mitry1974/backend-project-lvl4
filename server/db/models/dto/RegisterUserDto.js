import i18next from 'i18next';
import { registerDecorator, IsNotEmpty, IsEmail } from 'class-validator';
import Models from '..';

function IsUserAlreadyExist(validationOptions) {
  return function _IsUserAlreadyExist(object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: async (email) => !(await Models.User.findOne({ where: { email } })),
      },
    });
  };
}

export default class RegisterUserDto {
  @IsEmail({}, {
    message: () => `${i18next.t('views.users.errors.email_not_email')}`,
  })
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.email_not_empty')}`,
  })
  @IsUserAlreadyExist({
    message: () => `${i18next.t('views.users.errors.email_already_exists')}`,
  })
  email = '';

  firstname = '';

  lastname = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_not_empty')}`,
  })
  password = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_confirmation_not_empty')}`,
  })
  confirm = '';

  @IsNotEmpty()
  role = 'user';
}
