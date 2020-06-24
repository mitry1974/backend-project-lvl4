import addUserSchemas from './userSchemas';
import addKeywords from './keywords';


export default (ajv) => {
  addKeywords(ajv);
  addUserSchemas(ajv);
};
