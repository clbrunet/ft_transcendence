import {MigrationInterface, QueryRunner} from "typeorm";

export class myInit1626421061711 implements MigrationInterface {
    name = 'myInit1626421061711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "isArchived" boolean NOT NULL DEFAULT false, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "internalComment" character varying(300), "first_name" character varying(300) NOT NULL, "last_name" character varying(300) NOT NULL, "email" character varying(300) NOT NULL, "phone" character varying(300) NOT NULL, "address" character varying(300) NOT NULL, "description" character varying(300) NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
