import i18next from 'i18next';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsEntityExist, IsTheSameAs } from './decorators';
import Models from '../../db/models';

export default class RegisterUserSchema {
  @IsEmail({}, {
    message: () => `${i18next.t('views.users.errors.emailNotEmail')}`,
  })
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.emailNotEmpty')}`,
  })
  @IsEntityExist(Models.User, 'email', false, {
    message: () => `${i18next.t('views.users.errors.emailAlreadyExists')}`,
  }, false)
  email = '';

  firstname = '';

  lastname = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.passwordNotEmpty')}`,
  })
  password = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.passwordConfirmationNotEmpty')}`,
  })
  @IsTheSameAs(
    'password',
    true,
    {
      message: () => `${i18next.t('views.users.errors.passwordConfirmationTheSameAsPassword')}`,
    },
  )
  confirm = '';

  @IsNotEmpty()
  role = 'user';
}
