import i18next from 'i18next';

const userProperties = {
  email: { type: 'string', format: 'email' },
  firstname: { type: 'string' },
  lastname: { type: 'string' },
  password: { type: 'string' },
  confirm: { type: 'string' },
  role: { type: 'string' },
};

const tags = ['user'];

const paramsUserJsonSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', IsUserAlreadyExist: true },
  },
  required: ['email'],
};

const userRegisterBodyJsonSchema = {
  type: 'object',
  $flashErrorMessage: `${i18next.t('flash.users.create.error')}`,
  $url: '/users/register',
  properties: {
    formData: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          isNotEmpty: true,
        },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        password: { type: 'string', isNotEmpty: true },
        confirm: { type: 'string', isNotEmpty: true, isPasswordMatch: true },
        role: { type: 'string' },
      },
      required: ['email', 'password', 'confirm', 'role'],
      errorMessage: {
        required: {
          email: `${i18next.t('views.users.errors.email_not_empty')}`,
          password: `${i18next.t('views.users.errors.password_not_empty')}`,
          confirm: `${i18next.t('views.users.errors.password_confirmation_not_empty')}`,
        },
        properties: {
          email: `${i18next.t('views.users.errors.email')}`,
          password: `${i18next.t('views.users.errors.password_not_empty')}`,
          confirm: `${i18next.t('views.users.errors.password_confirmation')}`,
        },
      },
    },
  },
  required: ['formData'],
};

const userUpdateBodyJsonSchema = {
  type: 'object',
  properties: userProperties,
  required: ['email', 'password', 'confirm'],
};

const registerUserSchema = {
  $id: 'registerUserSchema',
  body: userRegisterBodyJsonSchema,
};

const updateUserSchema = {
  $id: 'updateUserSchema',
  tags,
  params: paramsUserJsonSchema,
  body: userUpdateBodyJsonSchema,
};

const deleteUserSchema = {
  $id: 'deleteUserSchema',
  tags,
  params: paramsUserJsonSchema,
};

const getAllUsersSchema = {
  $id: 'getAllUsersSchema',
  tags,
};

const getUserSchema = {
  $id: 'getUserSchema',
  tags,
  params: paramsUserJsonSchema,
};

export default {
  registerUserSchema, updateUserSchema, getUserSchema, getAllUsersSchema, deleteUserSchema,
};
// const schemas = [
//   registerUserSchema, updateUserSchema, getUserSchema, getAllUsersSchema, deleteUserSchema,
// ];

// export default (ajv) => {
//   schemas.forEach((schema) => {
//     console.log(`Schema: ${JSON.stringify(schema)}`);
//     ajv.addSchema(schema);
//   });
// };
