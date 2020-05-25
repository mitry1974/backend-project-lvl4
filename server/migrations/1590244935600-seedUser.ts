import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import User from '../entity/User.js';

const userData = [
  {
    firstname: 'Pitt',
    lastname: 'Bull',
    email: "pittbull@fakedomain.com",
    password: "123456",
    role: "user",
  },
  {
    firstname: 'Corona',
    lastname: 'Virus',
    email: 'coronavirus@2020.ru',
    password: '123456',
    role: 'admin',
  },
  {
    firstname: 'Dino',
    lastname: 'Zavr',
    email: 'dinozavr@fakedomain.com',
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
