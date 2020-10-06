export default (app) => app.addSchema({
  $id: 'loginSchema',
  type: 'object',
  $async: true,
  required: ['email', 'password'],
  properties: {
    email: {
      format: 'email',
      isNotEmpty: true,
      errorMessage: {
        format: `${app.i18n.t('views.users.errors.emailNotEmail')}`,
        isNotEmpty: `${app.i18n.t('views.users.errors.emailNotEmpty')}`,
      },
    },
    password: {
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.users.errors.passwordNotEmpty')}`,
      },
    },
  },
});
