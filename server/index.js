import 'reflect-metadata';
import fastify from 'fastify';
import i18next from 'i18next';
import pug from 'pug';
import path from 'path';
import config from 'config';
import Rollbar from 'rollbar';

import webpackConfig from '../webpack.config';
import getHelpers from './helpers';
import ru from './locales/ru';
import Models from './db/models';
import Guest from './db/models/Guest';
import verifyAdmin from './lib/auth';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isTest = env === 'test';
const isDevelopment = !isProduction && !isTest;
const registerPlugins = (app) => {
  app.register(import('fastify-error-page'));
  app.register(import('fastify-reverse-routes'));
  app.register(import('fastify-formbody'));

  console.log(`Application config: ${JSON.stringify(app.config)}`);
  app.register(import('fastify-secure-session'), {
    secret: app.config.get('SESSION_KEY'),
    cookie: {
      path: '/',
    },
  });

  app.register(import('fastify-auth'));
  app.decorate('verifyAdmin', verifyAdmin);

  app.register(import('fastify-flash'));
  console.log(`Database config: ${JSON.stringify(app.config.db)}`);
  app.register(import('fastify-sequelize'), app.config.db);

  app.register(import('./routes'));
};

const setupStaticAssets = (app) => {
  app.register(import('fastify-static'), {
    root: path.resolve(__dirname, '../', 'public'),
    prefix: '/assets/',
  });
};

const setupViews = (app) => {
  const helpers = getHelpers(app);

  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';

  app.register(import('point-of-view'), {
    engine: {
      pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => {
        const assetPath = `${domain}/assets/${filename}`;
        return assetPath;
      },
    },
    templates: path.resolve(__dirname, 'views'),
  });
  app.decorateReply('render', function render(renderPath, locals) {
    this.view(renderPath, { ...locals, reply: this });
  });
};

const setupHooks = (app) => {
  app.decorateRequest('currentUser', null);
  app.decorateRequest('signedIn', false);

  app.addHook('preHandler', async (req) => {
    const userId = req.session.get('userId');
    if (userId) {
      const currentUser = await Models.User.findOne({ where: { id: userId } });
      if (currentUser) {
        req.currentUser = currentUser;
        req.signedIn = true;
        return;
      }
      req.session.set('userId', null);
    }
    req.signedIn = false;
    req.currentUser = new Guest();
  });
};

const setupLocalization = () => {
  i18next
    .init({
      lng: 'ru',
      fallbackLng: 'en',
      debug: isDevelopment,
      resources: {
        ru,
      },
    });
};

export default async () => {
  const app = fastify({
    logger: {
      level: 'trace',
      prettyPrint: isDevelopment,
      timestamp: !isDevelopment,
      base: null,
    },
  });

  app.decorate('config', config);

  registerPlugins(app);
  setupViews(app);
  setupStaticAssets(app);
  setupHooks(app);
  setupLocalization(app);

  const rollbar = new Rollbar(app.config.get('ROLLBAR_KEY'));
  app.setErrorHandler(async (error, request, reply) => {
    console.log('MAIN ERROR HANDLER');
    rollbar.error(error, request);
    reply.status(500);
    reply.send();
  });

  await app.ready();
  return app;
};
