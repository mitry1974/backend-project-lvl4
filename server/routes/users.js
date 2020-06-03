import i18next from 'i18next';
import Models from '../db/models';
import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';

export default (app) => {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  AjvErrors(ajv);

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

  app.route({
    method: 'GET',
    url: '/users/new',
    name: 'getRegisterUserForm',
    handler: async (request, reply) => {
//    const userData = {}; //new Models.User();
      reply.render('users/register', {
        userData: {
          email: 'eeee',
        },
        action: app.reverse('registerUser'),
        caption: 'Register user',
      });
      return reply;
    }
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

  app.route({
    method: 'POST',
    url: '/users',
    schema: { body: app.getSchemas().bodyRegisterUserSchema  },
    attachValidation: true,
    schemaCompiler: schema => {
      const validate = ajv.compile(schema)
      return validate
    },
    name: 'registerUser',
    preHandler: async(request, reply) =>{
      console.log('prehandler!!!!!!!!!!!!!!!!!!');
      console.log(`    request:${JSON.stringify(request.body)}`);
    },
    handler: async (request, reply) => {
      const userData = request.body.userData;
      if (request.validationError) {
        console.log(`Validation errors!!!: ${JSON.stringify(request.validationError)}`)
        request.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/register', { userData, errors: request.validationError.validation });
        return reply;
      }
      console.log(`In handler, schema validated!!!!!!!!!!!!!, userData: ${request.body.userData}`)
      const user = Models.User.build(userData);
      user.password = userData.password;
      user.confirm = userData.confirm;

      await user.save();

      request.flash('info', i18next.t('flash.users.create.success'));
      reply.redirect(app.reverse('root'));
      return reply;
    }
  });

  app.post('/users/:id', { name: 'saveUser' }, async (request, reply) => {
    const userId = request.params.id;
    const userData = request.body.user;
    if (!userId) {
      throw new Error('Save user with null userId');
    }
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
