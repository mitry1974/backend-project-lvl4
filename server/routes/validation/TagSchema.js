import i18next from 'i18next';
import { IsNotEmpty } from 'class-validator';
import { IsEntityExist } from './decorators';
import Models from '../../db/models';

export default class TagValidationSchema {
  @IsEntityExist(Models.Tag, 'name', false, {
    message: () => `${i18next.t('views.tags.errors.tagAlreadyExists')}`,
  }, false)
  @IsNotEmpty({
    message: () => `${i18next.t('views.tags.errors.tagNotEmpty')}`,
  })
  name = '';
}
