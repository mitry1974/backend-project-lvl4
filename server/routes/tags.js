import i18next from 'i18next';
import Models from '../db/models';
import { validateBody } from './validation';

const getTagById = (id) => Models.Tag.findByPk(id);

export default (app) => {
  app.get('/tags', { name: 'getAllTags' }, async (request, reply) => {
    const tags = await Models.Tag.findAll();
    reply.render('tags/list', { tags });
    return reply;
  });

  app.route({
    method: 'GET',
    url: '/tags/createTag',
    name: 'getNewTagForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const formData = Models.Tag.build();
      reply.render('tags/new', { formData });
      return reply;
    },
  });

  app.route({
    method: 'GET',
    url: '/tags/:id/editTag',
    name: 'getEditTagForm',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const formData = await getTagById(request.params.id);
      reply.render('tags/edit', { formData });
      return reply;
    },
  });

  app.route({
    method: 'POST',
    url: '/tags',
    name: 'createTag',
    preHandler: app.auth([app.verifyLoggedIn]),
    config: {
      flashMessage: 'flash.tags.create.error',
      template: `${'tags/new'}`,
      schemaName: 'tagSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
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
    preHandler: app.auth([app.verifyLoggedIn]),
    config: {
      flashMessage: 'flash.tags.update.error',
      template: `${'tags/edit'}`,
      schemaName: 'tagSchema',
    },
    preValidation: async (request, reply) => validateBody(app, request, reply),
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

  app.route({
    method: 'DELETE',
    url: '/tags/:id',
    name: 'deleteTag',
    preHandler: app.auth([app.verifyLoggedIn]),
    handler: async (request, reply) => {
      const tag = await getTagById(request.params.id);
      try {
        await tag.destroy();
      } catch (e) {
        request.flash('error', i18next.t('flash.tags.delete.error'));
        reply.redirect(app.reverse('getAllTags'));
        return reply;
      }
      request.flash('info', i18next.t('flash.tags.delete.success'));
      reply.redirect(app.reverse('getAllTags'));
      return reply;
    },
  });
};
