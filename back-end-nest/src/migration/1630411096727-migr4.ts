import {MigrationInterface, QueryRunner} from "typeorm";

export class migr41630411096727 implements MigrationInterface {
    name = 'migr41630411096727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "queueTime" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "queueTime" DROP DEFAULT`);
    }

}
