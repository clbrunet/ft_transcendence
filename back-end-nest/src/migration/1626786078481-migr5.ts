import {MigrationInterface, QueryRunner} from "typeorm";

export class migr51626786078481 implements MigrationInterface {
    name = 'migr51626786078481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "channel_name" character varying NOT NULL, "status" integer NOT NULL DEFAULT '0', "password" character varying NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_82553d18a60331b291c927e5ffe" UNIQUE ("channel_name"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_823bae55bd81b3be6e05cff4383" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_823bae55bd81b3be6e05cff4383"`);
        await queryRunner.query(`DROP TABLE "channel"`);
    }

}
