import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';
import { IsEntityExist } from './decorators';
import Models from '../../db/models';

export default class TaskStatusValidationSchema {
  @IsNotEmpty({
    message: () => `${i18next.t('views.taskStatuses.errors.nameNotEmpty')}`,
  })
  @IsEntityExist(Models.TaskStatus, 'name', false, {
    message: () => `${i18next.t('views.taskStatuses.errors.nameNotExist')}`,
  }, false)
  name = '';
}
