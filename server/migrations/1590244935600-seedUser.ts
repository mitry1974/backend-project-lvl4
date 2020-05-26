import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import User from '../entity/User.js';

const userData = [
  {
    email: "pittbull@fakedomain.com",
    firstname: 'Pitt',
    lastname: 'Bull',
    password: "123456",
    role: "user",
  },
  {
    email: 'coronavirus@2020.ru',
    firstname: 'Corona',
    lastname: 'Virus',
    password: '123456',
    role: 'admin',
  },
  {
    email: 'dinozavr@fakedomain.com',
    firstname: 'Dino',
    lastname: 'Zavr',
    password: '123456',
    role: 'guest',
  },
];

export class seedUser1590244935600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const userRepo = getRepository('User');
      const users = userData.map(ud => new User(ud));
      console.log(`Migration, users before save: ${JSON.stringify(users)}`);
      await userRepo.save(users);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
