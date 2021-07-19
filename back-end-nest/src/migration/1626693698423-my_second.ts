import {MigrationInterface, QueryRunner} from "typeorm";

export class mySecond1626693698423 implements MigrationInterface {
    name = 'mySecond1626693698423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "authenticated" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_games" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_wins" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_losses" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "xp" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "xp" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_losses" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_wins" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "n_games" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "authenticated" DROP DEFAULT`);
    }

}
