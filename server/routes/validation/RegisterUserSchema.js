import i18next from 'i18next';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsUserAlreadyExist, IsTheSameAs } from './decorators';

export default class RegisterUserSchema {
  @IsEmail({}, {
    message: () => `${i18next.t('views.users.errors.email_not_email')}`,
  })
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.email_not_empty')}`,
  })
  @IsUserAlreadyExist({
    message: () => `${i18next.t('views.users.errors.email_already_exists')}`,
  }, false)
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
  @IsTheSameAs(
    'password',
    true,
    {
      message: () => `${i18next.t('views.users.errors.password_confirmation_the_same_as_password')}`,
    },
  )
  confirm = '';

  @IsNotEmpty()
  role = 'user';
}
