import { createTestApp } from './lib/utils';
import { validate } from '../server/routes/validation';

describe('Test validation', () => {
  let app = null;
  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(() => {
    app.close();
  });

  describe('Test user schemas', () => {
    test('Register new user schema test with good data', async () => {
      const registerUserData = {
        email: 'admin1@fakedomain.com',
        password: '1234567',
        confirm: '1234567',
        role: 'user',
      };
      const errors = await validate(app, 'registerUserSchema', registerUserData);
      expect(errors).toBeNull();
    });

    test('Register new user schema test with wrong data', async () => {
      const registerUserData = {
        email: 'admin@fakedomain.com',
        password: '23',
        confirm: '123',
        role: '',
      };

      const errors = await validate(app, 'registerUserSchema', registerUserData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(3);
      expect(keys[0]).toBe('email');
      expect(keys[1]).toBe('confirm');
      expect(keys[2]).toBe('role');
    });

    test('Update user with good data', async () => {
      const updateUserData = {
        id: '1',
        email: 'admin1@fakedomain.com',
        role: 'user',
      };

      const errors = await validate(app, 'updateUserSchema', updateUserData);
      expect(errors).toBeNull();
    });

    test('Update user with wrong data', async () => {
      const updateUserData = {
        email: 'email',
        role: '',
      };
      const errors = await validate(app, 'updateUserSchema', updateUserData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(2);
      expect(keys[0]).toBe('email');
      expect(keys[1]).toBe('role');
    });

    test('Login with good data', async () => {
      const loginData = {
        email: 'admin@fakedomain.com',
        password: 'password',
      };
      const errors = await validate(app, 'loginSchema', loginData);
      expect(errors).toBeNull();
    });

    test('Login with wrong data', async () => {
      const loginData = {
        email: 'email',
        password: '',
      };
      const errors = await validate(app, 'loginSchema', loginData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(2);
    });

    test('Test update password schema with good data', async () => {
      const updatePasswordData = {
        oldPassword: 'password',
        password: '123456',
        confirm: '123456',
      };
      const errors = await validate(app, 'updatePasswordSchema', updatePasswordData);
      expect(errors).toBeNull();
    });

    test('Test update password schema with wrong data', async () => {
      const updatePasswordData = {
        oldPassword: '',
        password: '',
        confirm: '123456',
      };
      const errors = await validate(app, 'updatePasswordSchema', updatePasswordData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(3);
      expect(keys[0]).toBe('oldPassword');
      expect(keys[1]).toBe('password');
      expect(keys[2]).toBe('confirm');
    });
  });

  describe('Test tag schemas', () => {
    test('Test tag schemas with good data', async () => {
      const tagData = {
        name: 'Javascript',
      };
      const errors = await validate(app, 'tagSchema', tagData);
      expect(errors).toBeNull();
    });

    test('Test tag schemas with existing key', async () => {
      const tagData = {
        name: 'tag1',
      };
      const errors = await validate(app, 'tagSchema', tagData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(1);
    });

    test('Test tag schemas with zero length key', async () => {
      const tagData = {
        name: '',
      };
      const errors = await validate(app, 'tagSchema', tagData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(1);
    });
  });

  describe('Test status schemas', () => {
    test('Test status schema with good data', async () => {
      const statusData = {
        name: 'archived',
      };
      const errors = await validate(app, 'taskStatusSchema', statusData);
      expect(errors).toBeNull();
    });

    test('Test status schema with existing key', async () => {
      const statusData = {
        name: 'status1',
      };
      const errors = await validate(app, 'taskStatusSchema', statusData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(1);
    });

    test('Test tag schemas with zero length key', async () => {
      const statusData = {
        name: '',
      };
      const errors = await validate(app, 'taskStatusSchema', statusData);
      expect(errors).not.toBeNull();
      const keys = Object.keys(errors);
      expect(keys.length).toBe(1);
    });
  });

  describe('Test task schemas', () => {
    test('Test task schema with good data', async () => {
      const taskData = {
        name: 'Task20',
        creatorId: 1,
        assignedToId: 1,
        statusId: 1,
      };
      const errors = await validate(app, 'taskSchema', taskData);
      expect(errors).toBeNull();
    });

    test('Test task schema with existing name', async () => {
      const taskData = {
        name: 'Task1',
        creatorId: 1,
        assignedToId: 1,
        statusId: 1,
      };
      const errors = await validate(app, 'taskSchema', taskData);
      expect(errors).not.toBeNull();
    });

    test('Test task schema with empty name', async () => {
      const taskData = {
        name: '',
        creatorId: 1,
        assignedToId: 1,
        statusId: 1,
      };
      const errors = await validate(app, 'taskSchema', taskData);
      expect(errors).not.toBeNull();
    });
  });
});
