export default (app) => app.addSchema({
  $id: 'updateUserSchema',
  type: 'object',
  $async: true,
  required: ['email', 'role'],
  properties: {
    email: {
      format: 'email',
      isNotEmpty: true,
      isEntityExists: {
        model: 'User',
        findBy: 'email',
      },
      errorMessage: {
        format: `${app.i18n.t('views.users.errors.emailNotEmail')}`,
        isNotEmpty: `${app.i18n.t('views.users.errors.emailNotEmpty')}`,
        isEntityExists: `${app.i18n.t('views.users.errors.emailAlreadyExists')}`,
      },
    },
    role: {
      isNotEmpty: true,
    },
  },
});
