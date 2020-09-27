import { registerDecorator } from 'class-validator';

export function IsEntityExist(model, property, shouldBe, validationOptions) {
  return function _IsEntityAlreadyExist(object, propertyName) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: async (value, args) => {
          const entityToFind = await model.findOne({ where: { [property]: value } });
          if (entityToFind && entityToFind.id === parseInt(args.object.id, 10)) {
            return true;
          }
          return (shouldBe === !!entityToFind);
        },
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
