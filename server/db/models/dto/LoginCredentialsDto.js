import i18next from 'i18next';
import { IsNotEmpty, IsEmail } from 'class-validator';

export default class LoginCredentialsDto {
  @IsEmail({}, {
    message: () => `${i18next.t('views.users.errors.email_not_email')}`,
  })
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.email_not_empty')}`,
  })
  email = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_not_empty')}`,
  })
  password = '';
}
