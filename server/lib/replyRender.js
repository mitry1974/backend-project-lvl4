import i18next from 'i18next';

export default ({
  request, reply, flashMessage, template, data,
}) => {
  request.flash('error', i18next.t(flashMessage));
  reply.code(400).render(template, { ...data });
  return reply;
};
