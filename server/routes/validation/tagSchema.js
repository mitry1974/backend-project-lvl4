export default (app) => app.addSchema({
  $id: 'tagSchema',
  type: 'object',
  $async: true,
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      isNotEmpty: true,
      isEntityExists: {
        model: 'Tag',
        findBy: 'name',
      },
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.tags.errors.tagNotEmpty')}`,
        isEntityExists: `${app.i18n.t('views.tags.errors.tagAlreadyExists')}`,
      },
    },
  },
});
