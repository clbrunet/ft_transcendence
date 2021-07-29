import {MigrationInterface, QueryRunner} from "typeorm";

export class migr21627567774505 implements MigrationInterface {
    name = 'migr21627567774505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" ALTER COLUMN "channelStatus" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" ALTER COLUMN "channelStatus" DROP NOT NULL`);
    }

}
