import path from 'path';
import replyRender from '../../lib/replyRender';

const addSchemas = (app) => {
  const schemas = [
    'registerUserSchema.js', 'taskSchema.js', 'loginSchema.js',
    'tagSchema.js', 'taskStatusSchema.js', 'updatePasswordSchema.js',
    'updateUserSchema.js',
  ];
  schemas.map(async (schemaFilename) => {
    const schemaPathname = path.resolve(__dirname, schemaFilename);
    const addSchema = await import(schemaPathname);
    addSchema.default(app);
  });
};

const addKeywords = (app) => {
  app.ajv.addKeyword('isNotEmpty', {
    type: 'string',
    errors: false,
    validate: function isNotEmpty(schema, value) {
      return typeof value === 'string' && value.trim() !== '';
    },
  });

  app.ajv.addKeyword('isTheSameAs', {
    type: 'string',
    validate: function isTheSameAs(schema, value, parentSchema, currentPath, dataObject) {
      return dataObject.password === value;
    },
    errors: false,
  });

  app.ajv.addKeyword('isEntityExists', {
    type: 'string',
    errors: false,
    async: true,
    validate: async function isEntityExists(schema, value, parentSchema, currentPath, dataObject) {
      const model = app.db.models[schema.model];
      const entity = await model.findOne({ where: { [schema.findBy]: value } });
      if (entity && entity.id === parseInt(dataObject.id, 10)) {
        return true;
      }
      const isEntityFound = !!entity;
      return !isEntityFound;
    },
  });
};

const parseAjvErrors = (ajvErrors) => {
  if (ajvErrors) {
    const errors = {};
    ajvErrors.forEach((error) => {
      const key = error.dataPath.replace(/^[/]+|[/]+$/g, '');
      const currentMessage = errors[key];
      if (currentMessage) {
        errors[key] = [currentMessage, error.message].join('; ');
      } else {
        errors[key] = error.message;
      }
    });
    return errors;
  }
  return null;
};

const validate = async (app, schemaName, data) => {
  try {
    const schema = app.getSchemas()[schemaName];
    await app.ajv.validate(schema, data);
    return null;
  } catch (e) {
    return parseAjvErrors(e.errors);
  }
};

/*
  const renderWithErrors = ({
    request, reply, url, flashMessage, renderData,
  }) => {
    request.log.error(
    `Validation error: validated ${JSON.stringify(renderData.formData)},
    errors: ${JSON.stringify(renderData.errors, null, '\t')}`
    );
    request.flash('error', flashMessage);
    reply.code(400).render(url, renderData);
    // return reply;
  };
*/

const formatValidationErrorString = (formData, errors) => `Validation error: validated ${JSON.stringify(formData)}, errors: ${JSON.stringify(errors, null, '\t')}`;

const validateBody = async (app, request, reply, renderData = {}) => {
  const { formData } = request.body;
  const { schemaName, flashMessage, template } = reply.context.config;
  const errors = await validate(app, schemaName, formData);
  if (errors) {
    request.log.error(formatValidationErrorString(formData, errors));
    return replyRender({
      request, reply, flashMessage, template, data: { formData, errors, ...renderData },
    });
  }
  return true;
};

export {
  addSchemas,
  addKeywords,
  parseAjvErrors,
  validate,
  formatValidationErrorString,
  validateBody,
};
