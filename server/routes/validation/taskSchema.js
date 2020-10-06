export default (app) => app.addSchema({
  $id: 'taskSchema',
  type: 'object',
  $async: true,
  required: ['name', 'creatorId', 'assignedToId', 'statusId'],
  errorMessage: {
    required: {
      name: `${app.i18n.t('views.tasks.errors.nameNotEmpty')}`,
      statusId: `${app.i18n.t('views.tasks.errors.statusNotEmpty')}`,
      creatorId: `${app.i18n.t('views.tasks.errors.creatorNotEmpty')}`,
      assignedToId: `${app.i18n.t('views.tasks.errors.assignedNotEmpty')}`,
    },
  },
  properties: {
    name: {
      type: 'string',
      isNotEmpty: true,
      isEntityExists: {
        model: 'Task',
        findBy: 'name',
      },
      errorMessage: {
        isNotEmpty: `${app.i18n.t('views.tasks.errors.nameNotEmpty')}`,
        isEntityExists: `${app.i18n.t('views.tasks.errors.nameExist')}`,
      },
    },
  },
});
