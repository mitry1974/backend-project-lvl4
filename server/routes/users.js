import i18next from 'i18next';
import { validate } from 'class-validator';
import User from '../entity/User';
import encrypt from '../lib/secure';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (request, reply) => {
      const users = await app.orm.getRepository(User).find();
      reply.render('/users/list', { users });
      return reply;
    })
    .get('/users/new', { name: 'getRegisterUserForm' }, (request, reply) => {
      console.log('users: getRegisterUserForm');
      const user = new User();
      reply.render('users/register', {
        user,
        action: app.reverse('registerUser'),
        caption: 'Register user',
      });
      return reply;
    })
    .get('/users/:id', { name: 'getEditUserForm' }, async (request, reply) => {
      const userId = request.session.get('userId') || request.params.id;
      if (!userId) {
        throw new Error('Edit user with missing user id');
      }
      const user = await User.findOne({ where: { id: userId } });
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


  app
    .post('/users', { name: 'registerUser' }, async (request, reply) => {
      const userData = request.body.user;
      const user = User.create(userData);
      user.password = encrypt(userData.rawPassword);
      user.rawPassword = userData.rawPassword;
      user.rawPasswordConfirm = userData.rawPasswordConfirm;
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
    })
    .post('/users/:id', { name: 'saveUser' }, async (request, reply) => {
      const userId = request.params.id;
      const userData = request.body.user;
      if (!userId) {
        throw new Error('Save user with null userId');
      }
      console.log(`Save user, userId isn't null, try to find user with id: ${userId}`);
      const user = await User.findOne(userId);
      if (!user) {
        console.log('Save user didn\'t found');
        throw new Error('Save user, user not found');
      }
      user.email = userData.email;
      user.firstname = userData.firstname;
      user.lastname = userData.lastname;

      user.rawPassword = userData.rawPassword;
      user.rawPasswordConfirmation = userData.rawPasswordConfirmation;
      user.password = encrypt(userData.rawPassword || '');
      console.log(`user before validation ==========================> ${JSON.stringify(user)}`);
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
