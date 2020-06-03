import i18next from 'i18next';

export default async (error, request, reply) => {
  console.log(`Routes Error handler, error: ${error}`);
  console.log(`Routes Error handler,user: ${JSON.stringify(request.body.user)}`);
  if (error.validation) {
    console.log(`validation error: ${JSON.stringify(error.validation)}`);
    request.flash('error', i18next.t('flash.users.create.error'));
    reply.render('users/register', { user:request.body.user, errors  });
    return reply;
  }
}
