import i18next from 'i18next';
import Models from '../db/models';

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

  app.post('/tags', { name: 'createTag' }, async (request, reply) => {
    try {
      await Models.Tag.create(request.body.formData);
    } catch (e) {
      request.flash('error', i18next.t('flash.tags.create.error'));
      reply.render('tags/new');
    }

    reply.redirect(app.reverse('getAllTags'));
    return reply;
  });

  app.put('/tags/:id', { name: 'updateTag' }, async (request, reply) => {
    const tag = await getTagById(request.params.id);
    await tag.update(request.body.formData);
    reply.redirect(app.reverse('getAllTags'));
    return reply;
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
