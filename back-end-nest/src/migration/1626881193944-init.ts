import {MigrationInterface, QueryRunner} from "typeorm";

export class init1626881193944 implements MigrationInterface {
    name = 'init1626881193944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_display_name" character varying NOT NULL, "user_id" character varying NOT NULL, "channel_name" character varying NOT NULL, "channel_id" character varying NOT NULL, "admin" boolean NOT NULL DEFAULT false, "mute" boolean NOT NULL DEFAULT false, "ban" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "channelId" uuid, CONSTRAINT "UQ_ff3fea4f0d25c1555cb212a3d94" UNIQUE ("user_display_name"), CONSTRAINT "UQ_7916773e236a9cfc13d59f96a4a" UNIQUE ("user_id"), CONSTRAINT "UQ_cec9fb6cc1a315e10d7b21101f5" UNIQUE ("channel_name"), CONSTRAINT "UQ_92471f1bb3afd075b5767a6bc98" UNIQUE ("channel_id"), CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "display_name" character varying NOT NULL, "mail" character varying NOT NULL, "password" character varying NOT NULL, "avatar_path" character varying NOT NULL DEFAULT '../assets/default_avatar.jpg', "authenticated" boolean NOT NULL DEFAULT false, "status" integer NOT NULL DEFAULT '0', "n_games" integer NOT NULL DEFAULT '0', "n_wins" integer NOT NULL DEFAULT '0', "n_losses" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '0', "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ac8db728c0a6f0e920fa66e534c" UNIQUE ("display_name"), CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f" UNIQUE ("mail"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel_name" character varying NOT NULL, "owner_display_name" character varying NOT NULL, "owner_id" character varying NOT NULL, "status" integer NOT NULL, "password" character varying NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "UQ_82553d18a60331b291c927e5ffe" UNIQUE ("channel_name"), CONSTRAINT "UQ_b441e6fbf60558a262ef05399bf" UNIQUE ("owner_display_name"), CONSTRAINT "UQ_033c6c164664caf44ca6199d63b" UNIQUE ("owner_id"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "participant"`);
    }

}
