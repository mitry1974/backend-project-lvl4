import faker from 'faker';

function generateFakeUserRegisterData(options) {
  const password = faker.internet.password();
  const generated = {
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password,
    confirm: password,
    role: options.role,
  };

  return { ...generated, options };
}

export { generateFakeUserRegisterData };
