import {MigrationInterface, QueryRunner} from "typeorm";

export class myFourth1626706272790 implements MigrationInterface {
    name = 'myFourth1626706272790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_ac8db728c0a6f0e920fa66e534c" UNIQUE ("display_name")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f" UNIQUE ("mail")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_ac8db728c0a6f0e920fa66e534c"`);
    }

}
