import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';
import { IsTheSameAs } from './decorators';

export default class UpdatePasswordSchema {
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.oldPasswordNotEmpty')}`,
  })
  oldPassword = '';

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
}
