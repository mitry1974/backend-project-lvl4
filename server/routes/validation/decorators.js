import { registerDecorator } from 'class-validator';
import Models from '../../db/models';

export function IsUserAlreadyExist(validationOptions, shouldBe) {
  return function _IsUserAlreadyExist(object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: async (email) => shouldBe === !!await Models.User.findOne({ where: { email } }),
      },
    });
  };
}

export function IsTheSameAs(propertyToCompare, shouldBe, validationOptions) {
  return function _IsTheSameAs(object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (data, args) => {
          const value = args.object[propertyToCompare];
          return shouldBe === (data === value);
        },
      },
    });
  };
}
