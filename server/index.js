import 'reflect-metadata';
import fastify from 'fastify';
import fastifyTypeORM from 'fastify-typeorm';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFlash from 'fastify-flash';
import fastifySession from 'fastify-secure-session';
import fastifyStatic from 'fastify-static';
import fastifyFormbody from 'fastify-formbody';
import i18next from 'i18next';
import pointOfView from 'point-of-view';
import pug from 'pug';
import path from 'path';
import config from 'config';
import Rollbar from 'rollbar';

import webpackConfig from '../webpack.config';
import setupRoutes from './routes';
import getHelpers from './helpers';
import ru from './locales/ru';
import User from './entity/User';
import Guest from './entity/Guest';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isTest = env === 'test';
const isDevelopment = !isProduction && !isTest;

const registerPlugins = (app) => {
  app.register(fastifyErrorPage);
  app.register(fastifyReverseRoutes);
  app.register(fastifyFormbody);

  app.register(fastifySession, {
    secret: app.config.get('SESSION_KEY'),
    cookie: {
      path: '/',
    },
  });
  app.register(fastifyFlash);
  app.register(fastifyTypeORM, app.config.db)
    .after((err) => {
      if (err) throw err;
    });
};

const setupStaticAssets = (app) => {
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../', 'dist', 'public'),
    prefix: '/assets/',
  });
};

const setupViews = (app) => {
  const helpers = getHelpers(app);

  const { devServer } = webpackConfig;
  const devHost = `http://${devServer.host}:${devServer.port}`;
  const domain = isDevelopment ? devHost : '';

  app.register(pointOfView, {
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
      const currentUser = await User.findOne({ where: { id: userId } });
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
  setupRoutes(app);
  setupHooks(app);
  setupLocalization(app);

  const rollbar = new Rollbar(app.config.get('ROLLBAR_KEY'));
  app.setErrorHandler((error, request) => {
    rollbar.error(error, request);
  });
  await app.ready();
  return app;
};
