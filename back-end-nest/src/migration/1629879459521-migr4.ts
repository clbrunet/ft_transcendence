import {MigrationInterface, QueryRunner} from "typeorm";

export class migr41629879459521 implements MigrationInterface {
    name = 'migr41629879459521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "UQ_5e14b4df8f849a695c6046fe741"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "channelName"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "channelStatus"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "channel" ADD "status" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD "channelStatus" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel" ADD "channelName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "UQ_5e14b4df8f849a695c6046fe741" UNIQUE ("channelName")`);
    }

}
