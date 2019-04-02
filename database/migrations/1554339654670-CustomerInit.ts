import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CustomerInit1554339654670 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'customer',
      columns: [
        {
          isPrimary: true,
          name: 'id',
          type: 'int',
        },
        {
          name: 'name',
          type: 'varchar',
        },
      ],
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('customer');
  }

}
