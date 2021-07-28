import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1627486362682 implements MigrationInterface {
    name = 'myInit1627486362682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "twoFactorAuthenticationSecret" character varying, "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT '../assets/default_avatar.png', "status" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '0', "n_games" integer NOT NULL DEFAULT '0', "n_wins" integer NOT NULL DEFAULT '0', "n_losses" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
