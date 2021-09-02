import {MigrationInterface, QueryRunner} from "typeorm";

export class migr21630513672142 implements MigrationInterface {
    name = 'migr21630513672142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isFortyTwoAccount" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isFortyTwoAccount"`);
    }

}
