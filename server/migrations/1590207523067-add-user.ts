import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class addUser1590207523067 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'email',
              type: 'varchar',
            },
            {
              name: 'firstname',
              type: 'varchar',
            },
            {
              name: 'lastname',
              type: 'varchar',
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'role',
              type: 'varchar',
            }
          ],
        }),
        true,
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }

}
