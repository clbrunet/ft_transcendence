import {MigrationInterface, QueryRunner} from "typeorm";

export class migr11629971269310 implements MigrationInterface {
    name = 'migr11629971269310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "admin" boolean NOT NULL DEFAULT false, "mute" boolean NOT NULL DEFAULT false, "muteDateTime" TIMESTAMP WITH TIME ZONE, "ban" boolean NOT NULL DEFAULT false, "banDateTime" TIMESTAMP WITH TIME ZONE, "userId" uuid, "channelId" uuid, CONSTRAINT "UQ_e680caf2e9903f9647eff3c04f6" UNIQUE ("userId", "channelId"), CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "twoFactorAuthenticationSecret" character varying, "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false, "avatar" character varying NOT NULL DEFAULT '../assets/default_avatar.png', "status" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '0', "nGames" integer NOT NULL DEFAULT '0', "nWins" integer NOT NULL DEFAULT '0', "nLosses" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" integer NOT NULL, "password" character varying, "ownerId" uuid, CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
