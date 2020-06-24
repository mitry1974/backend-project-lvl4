import Ajv from 'ajv';
import AjvErrors from 'ajv-errors';
import normalise from 'ajv-error-messages';
import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import routesErrorHandler from '../lib/routesErrorHandler';
import ValidationError from '../errors/ValidationError';
import addSchemas from './schemas';

const routes = [welcome, users, sessions];

const setupSchemaValidator = (app) => {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    nullable: true,
    jsonPointers: true,
  });

  AjvErrors(ajv);

  app.setSchemaCompiler((schema) => {
    const validate = ajv.compile(schema);
    return (data) => {
      const validationResult = validate(data);
      if (!validationResult) {
        const normalisedErrors = normalise(validate.errors);
        const errors = Object.keys(normalisedErrors.fields).reduce((acc, key) => {
          const field = key.split('/')[2];
          return { ...acc, [field]: normalisedErrors.fields[key] };
        }, []);
        console.log(`data to validate: ${JSON.stringify(data)}`);
        return {
          error: new ValidationError(
            {
              url: schema.$url,
              message: 'Validation error',
              formData: data.formData,
              errors,
              flashMessage: schema.$flashErrorMessage,
            },
          ),
        };
      }
      return true;
    };
  });

  app.setSchemaResolver((ref) => {
    const res = ajv.getSchema(ref).schema;
    return res;
  });
  addSchemas(ajv);
  return ajv;
};

export default async (app) => {
  app.setErrorHandler(routesErrorHandler);
  const ajv = setupSchemaValidator(app);
  return routes.forEach((f) => f(app, ajv));
};
