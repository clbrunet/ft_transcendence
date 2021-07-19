import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1626693478439 implements MigrationInterface {
    name = 'myInit1626693478439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying NOT NULL, "mail" character varying NOT NULL, "password" character varying NOT NULL, "avatar_path" character varying NOT NULL, "authenticated" boolean NOT NULL, "status" integer NOT NULL, "n_games" integer NOT NULL, "n_wins" integer NOT NULL, "n_losses" integer NOT NULL, "xp" integer NOT NULL, "level" integer NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
