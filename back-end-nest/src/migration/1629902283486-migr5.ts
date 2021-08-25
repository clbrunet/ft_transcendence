import {MigrationInterface, QueryRunner} from "typeorm";

export class migr51629902283486 implements MigrationInterface {
    name = 'migr51629902283486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "UQ_e680caf2e9903f9647eff3c04f6" UNIQUE ("userId", "channelId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "UQ_e680caf2e9903f9647eff3c04f6"`);
    }

}
