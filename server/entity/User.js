import {
  BeforeInsert, Entity, PrimaryGeneratedColumn, Column, BaseEntity,
} from 'typeorm';
import i18next from 'i18next';
import { registerDecorator, IsNotEmpty, IsEmail } from 'class-validator';
import bcrypt from 'bcrypt';

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
  constructor(userData) {
    super(userData);
    if (userData) {
      this.id = userData.id;
      this.email = userData.email;
      this.firstname = userData.firstname;
      this.lastname = userData.lastname;
      this.password = userData.password;
      this.confirm = userData.confirm;
      this.role = userData.role;
    }
  }

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

  @Column('varchar')
  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_not_empty')}`,
  })
  password = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.users.errors.password_confirmation_not_empty')}`,
  })
  confirm = '';

  @Column('varchar')
  @IsNotEmpty()
  role = 'user';

  @BeforeInsert()
  async setPassword() {
    const salt = await bcrypt.genSalt();
    if (this.password) {
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}

export default User;
