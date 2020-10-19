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
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import qs from 'qs';

import webpackConfig from '../webpack.config';
import routes from './routes';
import dbconfig from '../dbconfig';
import getHelpers from './lib/helpers';
import ru from './locales/ru';
import Models from './db/models';
import { verifyAdmin, verifyUserSelf, verifyLoggedIn } from './lib/auth';
import setupErrorHandler from './lib/errorHandler';
import { addSchemas, addKeywords } from './routes/validation';
import fastifyMethodOverride from './fastify-method-override/src';

const envpath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envpath });

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isTest = env === 'test';
const isDevelopment = !isProduction && !isTest;

const registerPlugins = async (app) => {
  await app.register(fastifyMethodOverride);
  await app.register(fastifyReverse.plugin);
  await app.register(fastifyFormbody, { parser: (str) => qs.parse(str) });

  await app.register(fastifySession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  app.decorate('verifyAdmin', verifyAdmin);
  app.decorate('verifyUserSelf', verifyUserSelf);
  app.decorate('verifyLoggedIn', verifyLoggedIn);
  await app.register(fastifyAuth);

  await app.register(fastifyFlash);
  let sequelize;
  if (dbconfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbconfig.use_env_variable]);
  } else {
    sequelize = new Sequelize(dbconfig);
  }
  app.decorate('sequelize', sequelize);
  await sequelize.authenticate();

  routes(app);
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
  app.addHook('onClose', async () => {
    await app.sequelize.close();
  });

  app.decorateRequest('currentUser', null);
  app.decorateRequest('signedIn', false);

  app.addHook('preHandler', async (req) => {
    const userId = req.session.get('userId');
    if (userId !== undefined) {
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

const setupValidation = (app) => {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });
  ajvErrors(ajv);
  app.decorate('ajv', ajv);
  addSchemas(app);
  addKeywords(app);
};

export default async () => {
  setupLocalization();
  // const logger = {
  //   level: 'trace',
  //   prettyPrint: !isProduction,
  //   timestamp: !isDevelopment,
  //   base: null,
  // };
  // const app = fastify({ logger });
  const app = fastify();
  setupErrorHandler(app);
  setupValidation(app);
  app.decorate('i18n', i18next);

  setupViews(app);
  await registerPlugins(app);
  setupStaticAssets(app);
  setupHooks(app);

  await app.ready();
  return app;
};
