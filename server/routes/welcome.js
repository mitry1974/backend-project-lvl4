export default (app) => {
  app
    .get('/', { name: 'root' }, (request, reply) => {
      reply.render('welcome/index');
    })
    .get('/about', { name: 'about' }, (request, reply) => {
      reply.render('welcome/about');
    });
};
