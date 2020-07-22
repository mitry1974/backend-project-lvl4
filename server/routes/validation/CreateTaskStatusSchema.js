import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';

export default class TaskStatusValidationSchema {
  @IsNotEmpty({
    message: () => `${i18next.t('views.taskStatuses.errors.name_not_empty')}`,
  })
  name = '';
}
