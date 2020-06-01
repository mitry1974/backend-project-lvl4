import i18next from 'i18next';
import { validate } from 'class-validator';
import Models from '../db/models';
// import encrypt from '../lib/secure';

export default (app) => {
  app.route({
    method: 'GET',
    url: '/users',
    name: 'users',
    preHandler: app.auth([app.verifyAdmin]),
    handler: async (request, reply) => {
      const users = await Models.User.findAll();
      reply.render('/users/list', { users });
      return reply;
    },
  });

  app.get('/users/new', { name: 'getRegisterUserForm' }, (request, reply) => {
    const user = new Models.User();
    reply.render('users/register', {
      user,
      action: app.reverse('registerUser'),
      caption: 'Register user',
    });
    return reply;
  });

  app.get('/users/:id', { name: 'getEditUserForm' }, async (request, reply) => {
    const userId = request.session.get('userId') || request.params.id;
    if (!userId) {
      throw new Error('Edit user with missing user id');
    }
    const user = await Models.User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Edit user with migging user');
    }

    reply.render('users/register', {
      user,
      action: app.reverse('saveUser', { id: userId }),
      caption: 'Save',
    });
    return reply;
  });


  app.post('/users', { name: 'registerUser' }, async (request, reply) => {
    const userData = request.body.user;
    console.log(`Register user: ${JSON.stringify(userData)}`);
    const user = Models.User.build(userData);
    user.password = userData.password;
    user.confirm = userData.confirm;
    const errors = await validate(user);
    if (errors.length !== 0) {
      request.flash('error', i18next.t('flash.users.create.error'));
      reply.render('users/register', { user, errors });
      return reply;
    }

    await user.save();

    request.flash('info', i18next.t('flash.users.create.success'));
    reply.redirect(app.reverse('root'));
    return reply;
  });

  app.post('/users/:id', { name: 'saveUser' }, async (request, reply) => {
    const userId = request.params.id;
    const userData = request.body.user;
    if (!userId) {
      throw new Error('Save user with null userId');
    }
    console.log(`Save user, userId isn't null, try to find user with id: ${userId}`);
    const user = await Models.User.findOne(userId);
    if (!user) {
      console.log('Save user didn\'t found');
      throw new Error('Save user, user not found');
    }
    user.email = userData.email;
    user.firstname = userData.firstname;
    user.lastname = userData.lastname;

    user.password = userData.password;
    user.confirm = userData.confirm;
    const errors = await validate(user, { register: false });
    if (errors.length !== 0) {
      request.flash('error', i18next.t('flash.users.create.error'));
      reply.render('users/register', { user, errors });
      return reply;
    }
    await user.save();

    request.flash('info', i18next.t('flash.users.create.success'));
    reply.redirect(app.reverse('root'));
    return reply;
  });
};
