export default (app) => app.addSchema({
  $id: 'taskStatusSchema',
  type: 'object',
  $async: true,
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      isNotEmpty: true,
      isEntityExists: {
        model: 'TaskStatus',
        findBy: 'name',
      },
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.taskStatuses.errors.nameNotEmpty')}`,
        isEntityExists: `${app.i18n.t('views.taskStatuses.errors.nameExists')}`,
      },
    },
  },
});
