export default (ajv) => {
  ajv.addKeyword('isPasswordMatch', {
    type: 'string',
    schema: false,
    errors: true,
    validate: function validate(confirm, propertyPath, data) {
      if (confirm !== data.password) {
        validate.errors = [];
        validate.errors.push({ keyword: 'isPasswordMatch', message: 'Shit shit shit' });
        return false;
      }
      return true;
    },
  });

  ajv.addKeyword('isNotEmpty', {
    type: 'string',
    schema: false,
    errors: true,
    validate: function validate(data) {
      const validationResult = typeof data === 'string' && data.trim() !== '';
      validate.errors = [];
      if (!validationResult) {
        validate.errors.push({ keyword: 'isNotEmpty', message: 'Shit shit shit' });
      }
      return validationResult;
    },
  });
};
