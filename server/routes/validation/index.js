import Ajv from 'ajv';
import path from 'path';
import Models from '../../db/models/index';
import ValidationError from '../../errors/ValidationError';

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
      const model = Models[schema.model];
      const entity = await model.findOne({ where: { [schema.findBy]: value } });
      if (entity && entity.id === parseInt(dataObject.id, 10)) {
        return true;
      }
      const isEntityFound = !!entity;
      return !isEntityFound;
    },
  });
};

const validate = async (app, schemaName, data) => {
  try {
    const schema = app.getSchemas()[schemaName];
    await app.ajv.validate(schema, data);
    return null;
  } catch (e) {
    if (e instanceof Ajv.ValidationError) {
      const errors = {};
      e.errors.forEach((error) => {
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
    throw e;
  }
};

const validateAndRender = async (app, schemaName, renderData) => {
  const errors = await validate(app, schemaName, renderData.data.formData);
  if (errors) {
    throw new ValidationError({
      errors,
      renderData,
    });
  }
};

export {
  addSchemas, addKeywords, validate, validateAndRender,
};
