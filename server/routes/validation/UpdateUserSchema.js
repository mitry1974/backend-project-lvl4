import i18next from 'i18next';
import { IsNotEmpty, IsEmail } from 'class-validator';

export default class UpdateUserSchema {
  @IsEmail({}, {
    message: () => `${i18next.t('views.users.errors.email_not_email')}`,
  })
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.email_not_empty')}`,
  }, true)
  email = '';

  firstname = '';

  lastname = '';
}
