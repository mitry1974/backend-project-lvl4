import 'reflect-metadata';
import fastify from 'fastify';
import i18next from 'i18next';
import pug from 'pug';
import path from 'path';
import fastifyFlash from 'fastify-flash';
import fastifyAuth from 'fastify-auth';
import fastifySession from 'fastify-secure-session';
import fastifyStatic from 'fastify-static';
import fastifyFormbody from 'fastify-formbody';
import fastifyReverse from 'fastify-reverse-routes';
import fastifyPointOfView from 'point-of-view';
import fastifyMethodOverride from 'fastify-method-override';
import Sequelize from 'sequelize';
import { dirname  } from 'path';
import { fileURLToPath  } from 'url';

import webpackConfig from '../webpack.config.js';
import dbconfig from '../dbconfig.js';
import getHelpers from './helpers/index.js';
import ru from './locales/ru.js';
import Models from './db/models/index.js';
import { verifyAdmin, verifyUserSelf, verifyLoggedIn } from './lib/auth.js';
import setupErrorHandler from './lib/errorHandler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isTest = env === 'test';
const isDevelopment = !isProduction && !isTest;

const registerPlugins = async (app) => {
  // app.register(fastifyErrorPage);
  app.register(fastifyReverse);
  app.register(fastifyFormbody);
  app.register(fastifyMethodOverride);

  app.register(fastifySession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  app.register(fastifyAuth);
  app.decorate('verifyAdmin', verifyAdmin);
  app.decorate('verifyUserSelf', verifyUserSelf);
  app.decorate('verifyLoggedIn', verifyLoggedIn);

  app.register(fastifyFlash);

  const sequelize = new Sequelize(dbconfig);
  app.decorate('sequelize', sequelize);
  await sequelize.authenticate();
  app.addHook('onClose', async () => {
    await app.sequelize.close();
  });

  app.register(import('./routes'));
};

const setupStaticAssets = (app) => {
  const pathPublic = isProduction
    ? path.join(__dirname, '..', 'public')
    : path.join(__dirname, '..', 'dist', 'public');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupViews = (app) => {
  const helpers = getHelpers(app);

  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';

  app.register(fastifyPointOfView, {
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
    req.currentUser = Models.Guest.build();
  });
};

const setupLocalization = () => i18next.init({
  preload: ['ru'],
  lng: 'ru',
  fallbackLng: 'en',
  debug: isDevelopment,
  resources: {
    ru,
  },
});

export default async () => {
  await setupLocalization();
  // const logger = {
  //   level: 'info',
  //   prettyPrint: !isProduction,
  //   timestamp: !isDevelopment,
  //   base: null,
  // };
  // const app = fastify({ logger });
  const app = fastify();
  app.decorate('i18n', i18next);

  setupViews(app);
  await registerPlugins(app);
  setupStaticAssets(app);
  setupHooks(app);

  setupErrorHandler(app);

  await app.ready();
  return app;
};
