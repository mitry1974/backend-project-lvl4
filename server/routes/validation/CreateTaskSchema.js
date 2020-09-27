import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';
import { IsEntityExist } from './decorators';
import Models from '../../db/models';

export default class UpdateUserSchema {
  @IsNotEmpty({
    message: () => `${i18next.t('views.tasks.errors.nameNotEmpty')}`,
  })
  @IsEntityExist(Models.Task, 'id', false, {
    message: () => `${i18next.t('views.tasks.errors.taskNameAlreadyExist')}`,
  })
  name = '';

  description = '';

  @IsNotEmpty({
    message: () => `${i18next.t('views.tasks.errors.statusNotEmpty')}`,
  })
  statusId = -1;

  @IsNotEmpty({
    message: () => `${i18next.t('views.tasks.errors.creatorNotEmpty')}`,
  })
  creatorId = -1;

  @IsNotEmpty({
    message: () => `${i18next.t('views.tasks.errors.assignedNotEmpty')}`,
  })
  assignedToId = -1;
}
