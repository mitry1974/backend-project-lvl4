export default (app) => app.addSchema({
  $id: 'registerUserSchema',
  type: 'object',
  $async: true,
  required: ['email', 'password', 'confirm', 'role'],
  errorMessage: {
    required: {
      email: `${app.i18n.t('views.users.errors.emailNotEmpty')}`,
      password: `${app.i18n.t('views.users.errors.passwordNotEmpty')}`,
      confirm: `${app.i18n.t('views.users.errors.passwordConfirmationNotEmpty')}`,
    },
  },
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
    password: {
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.users.errors.passwordNotEmpty')}`,
      },
    },
    confirm: {
      isNotEmpty: true,
      isTheSameAs: true,
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.users.errors.passwordConfirmationNotEmpty')}`,
        isTheSameAs: `${app.i18n.t('views.users.errors.passwordConfirmationTheSameAsPassword')}`,
      },
    },
    role: {
      type: 'string',
      isNotEmpty: true,
    },
  },
});
