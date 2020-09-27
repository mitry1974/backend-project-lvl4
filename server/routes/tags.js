import i18next from 'i18next';
import Models from '../db/models';
import validate from './validation/validate';
import TagSchema from './validation/TagSchema';

const getTagById = (id) => Models.Tag.findByPk(id);

export default (app) => {
  app.get('/tags', { name: 'getAllTags' }, async (request, reply) => {
    const tags = await Models.Tag.findAll();
    reply.render('tags/list', { tags });
    return reply;
  });

  app.get('/tags/createTag', { name: 'getNewTagForm' }, async (request, reply) => {
    const formData = Models.Tag.build();
    reply.render('tags/new', { formData });
    return reply;
  });

  app.get('/tags/:id/editTag', { name: 'getEditTagForm' }, async (request, reply) => {
    const formData = await getTagById(request.params.id);
    reply.render('tags/edit', { formData });
    return reply;
  });

  app.route({
    method: 'POST',
    url: '/tags',
    name: 'createTag',
    preValidation: async (request) => {
      const { formData } = request.body;
      await validate({
        ClassToValidate: TagSchema,
        objectToValidate: formData,
        renderData: {
          url: 'tags/new',
          flashMessage: i18next.t('flash.tags.create.error'),
          data: {
            formData,
          },
        },
      });
    },
    handler: async (request, reply) => {
      try {
        await Models.Tag.create(request.body.formData);
      } catch (e) {
        request.log.error(`Create tag error, ${e}`);
        throw e;
      }

      reply.redirect(app.reverse('getAllTags'));
      return reply;
    },
  });

  app.route({
    method: 'PUT',
    url: '/tags/:id',
    name: 'updateTag',
    preValidation: async (request) => {
      const { formData } = request.body;
      await validate({
        ClassToValidate: TagSchema,
        objectToValidate: formData,
        renderData: {
          url: 'tags/edit',
          flashMessage: i18next.t('flash.tags.update.error'),
          data: {
            formData,
          },
        },
      });
    },
    handler: async (request, reply) => {
      const tag = await getTagById(request.params.id);
      try {
        await tag.update(request.body.formData);
      } catch (e) {
        request.log.error(`Cant update tag, ${e}`);
        throw e;
      }
      reply.redirect(app.reverse('getAllTags'));
      return reply;
    },
  });

  app.delete('/tags/:id', { name: 'deleteTag' }, async (request, reply) => {
    const tag = await getTagById(request.params.id);
    try {
      await tag.destroy();
    } catch (e) {
      request.flash('error', i18next.t('flash.tags.delete.error'));
      reply.redirect(app.reverse('getAllTags'));
    }
    request.flash('info', i18next.t('flash.tags.delete.success'));
    reply.redirect(app.reverse('getAllTags'));
    return reply;
  });
};
