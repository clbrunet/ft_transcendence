import {MigrationInterface, QueryRunner} from "typeorm";

export class migr11627567598079 implements MigrationInterface {
    name = 'migr11627567598079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "twoFactorAuthenticationSecret" character varying, "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '../assets/default_avatar.png', "status" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '0', "nGames" integer NOT NULL DEFAULT '0', "nWins" integer NOT NULL DEFAULT '0', "nLosses" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channelName" character varying NOT NULL, "channelStatus" integer, "password" character varying, "ownerId" uuid, CONSTRAINT "UQ_5e14b4df8f849a695c6046fe741" UNIQUE ("channelName"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
