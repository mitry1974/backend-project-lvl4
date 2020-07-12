import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';
import { IsTheSameAs } from './decorators';

export default class UpdatePasswordSchema {
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.old_password_not_empty')}`,
  })
  oldPassword = '';

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
}
