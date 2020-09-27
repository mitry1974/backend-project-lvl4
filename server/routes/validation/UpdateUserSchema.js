import i18next from 'i18next';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsEntityExist } from './decorators';
import Models from '../../db/models';

export default class UpdateUserSchema {
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
}
