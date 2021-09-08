import {MigrationInterface, QueryRunner} from "typeorm";

export class migr11631085416699 implements MigrationInterface {
    name = 'migr11631085416699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" character varying NOT NULL, "status" integer NOT NULL, "authorId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorized" boolean NOT NULL DEFAULT false, "admin" boolean NOT NULL DEFAULT false, "mute" boolean NOT NULL DEFAULT false, "muteEndDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ban" boolean NOT NULL DEFAULT false, "banEndDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "left" boolean NOT NULL DEFAULT false, "userId" uuid, "channelId" uuid, CONSTRAINT "UQ_e680caf2e9903f9647eff3c04f6" UNIQUE ("userId", "channelId"), CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" integer NOT NULL, "password" character varying, "ownerId" uuid, CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE ("name"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL, "friendOwnerId" uuid, "friendId" uuid, CONSTRAINT "UQ_10f4cea527fc5f1b4913e1738c1" UNIQUE ("friendOwnerId", "friendId"), CONSTRAINT "PK_1b301ac8ac5fcee876db96069b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "duel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL, "duelOwnerId" uuid, "duelId" uuid, CONSTRAINT "UQ_5a11e41a5458c0c51fb46d56ed3" UNIQUE ("duelOwnerId", "duelId"), CONSTRAINT "PK_1575a4255b3bdf1f11398841d0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "queue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "queueTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "queuerId" uuid, CONSTRAINT "PK_4adefbd9c73b3f9a49985a5529f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "pointToVictory" integer NOT NULL, "status" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "point" integer NOT NULL DEFAULT '0', "userId" uuid, "gameId" uuid, CONSTRAINT "UQ_1226352721f49996c9bf0bbe9d2" UNIQUE ("userId", "gameId"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isFortyTwoAccount" boolean NOT NULL DEFAULT false, "twoFactorAuthenticationSecret" character varying, "isTwoFactorAuthenticationEnabled" boolean NOT NULL DEFAULT false, "avatar" character varying NOT NULL DEFAULT '../assets/default_avatar.png', "status" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '0', "nGames" integer NOT NULL DEFAULT '0', "nWins" integer NOT NULL DEFAULT '0', "nLosses" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "block" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL, "blockOwnerId" uuid, "blockId" uuid, CONSTRAINT "UQ_f69164dd0dcdaee0d26f42c8fff" UNIQUE ("blockOwnerId", "blockId"), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend" ADD CONSTRAINT "FK_fd63103ce8f0cf9d4f3d93ac2c5" FOREIGN KEY ("friendOwnerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend" ADD CONSTRAINT "FK_d9bf438025ff9f7ae947596b38e" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duel" ADD CONSTRAINT "FK_030a2338cdc4b57315e6eb6aac5" FOREIGN KEY ("duelOwnerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "duel" ADD CONSTRAINT "FK_d3c835a514a4a28c01029f4bf35" FOREIGN KEY ("duelId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue" ADD CONSTRAINT "FK_a312ee52215cfeffe9fe70e68fb" FOREIGN KEY ("queuerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_bbb950fb79ad87c29338d943e66" FOREIGN KEY ("blockOwnerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_5bdbcadcef3f691fa37dc0ec0cf" FOREIGN KEY ("blockId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_5bdbcadcef3f691fa37dc0ec0cf"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_bbb950fb79ad87c29338d943e66"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);
        await queryRunner.query(`ALTER TABLE "queue" DROP CONSTRAINT "FK_a312ee52215cfeffe9fe70e68fb"`);
        await queryRunner.query(`ALTER TABLE "duel" DROP CONSTRAINT "FK_d3c835a514a4a28c01029f4bf35"`);
        await queryRunner.query(`ALTER TABLE "duel" DROP CONSTRAINT "FK_030a2338cdc4b57315e6eb6aac5"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP CONSTRAINT "FK_d9bf438025ff9f7ae947596b38e"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP CONSTRAINT "FK_fd63103ce8f0cf9d4f3d93ac2c5"`);
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_c15fc716bc2a7c3e0ea49c78171"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`DROP TABLE "block"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "queue"`);
        await queryRunner.query(`DROP TABLE "duel"`);
        await queryRunner.query(`DROP TABLE "friend"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`DROP TABLE "participant"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
