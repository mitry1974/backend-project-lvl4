export default (app) => app.addSchema({
  $id: 'updatePasswordSchema',
  type: 'object',
  $async: true,
  required: ['oldPassword', 'password', 'confirm'],
  errorMessage: {
    required: {
      oldPassword: `${app.i18n.t('views.users.errors.oldPasswordNotEmpty')}`,
      password: `${app.i18n.t('views.users.errors.passwordNotEmpty')}`,
      confirm: `${app.i18n.t('views.users.errors.passwordConfirmationNotEmpty')}`,
    },
  },
  properties: {
    oldPassword: {
      type: 'string',
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.users.errors.oldPasswordNotEmpty')}`,
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
  },
});
