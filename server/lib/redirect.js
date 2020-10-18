import i18next from 'i18next';

const redirect = ({
  request, reply, flash, url,
}) => {
  request.flash(flash.type, i18next.t(flash.message));
  reply.redirect(302, url);
};

export default redirect;
