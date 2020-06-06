import i18next from 'i18next';

export default async function verifyAdmin(request, reply) {
  if (!request.currentUser || request.currentUser.role !== 'admin') {
    request.flash('error', i18next.t('flash.auth.error'));
    reply.code(401).render('welcome/index');
    return reply;
  }
}
