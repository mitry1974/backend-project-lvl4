import i18next from 'i18next';
import Ajv from 'ajv';

export default (app) => {

  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  ajv.addKeyword('emailExists', {
    schema: false,
    valid: true,
    validate: (data) => {
      console.log(`Custom email validator, data: ${data}`);
    },
    errors: false,
  });

  app.addSchema({
    $id: 'bodyRegisterUserSchema',
    type: 'object',
    properties: {
      userData: {
        type: "object",
        properties: {
          email: {
            type: 'string',
            format: 'email',
            emailExists: true,
            errorMessage: {
              format: `${i18next.t('views.users.errors.email_not_email')}`,
            }
          },
          firstname: { type: 'string' },
          lastname: { type: 'string' },
          password: { type: 'string' },
          confirm: { type: 'string' },
        },
        required: ['email', 'password', 'confirm'],
        errorMessage: {
          properties: {
            email: `${i18next.t('views.users.errors.email_not_email')}`,
            password: `${i18next.t('views.users.errors.password_not_empty')}`,
            confirm: `${i18next.t('views.users.errors.password_confirmation_not_empty')}`,
          },
        },
      }
    }
  });
}
