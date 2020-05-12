import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';
import i18next from 'i18next';
import { registerDecorator, IsNotEmpty, IsEmail } from 'class-validator';

/* eslint no-use-before-define: ["error", { "classes": false  }] */

function IsUserAlreadyExist(validationOptions) {
  return function _IsUserAlreadyExist(object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: async (email) => await User.findOne({ email }) === undefined,
      },
    });
  };
}

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = null;

  @Column('varchar')
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

  @Column('varchar')
  firstname = '';

  @Column('varchar')
  lastname = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_not_empty')}`,
  })
  rawPassword = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_confirmation_not_empty')}`,
  })
  rawPasswordConfirm = '';

  @Column('varchar')
  @IsNotEmpty()
  password = '';
}

export default User;
