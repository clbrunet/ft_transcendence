import {MigrationInterface, QueryRunner} from "typeorm";

export class migr31630410473558 implements MigrationInterface {
    name = 'migr31630410473558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "queue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "queueTime" TIMESTAMP WITH TIME ZONE NOT NULL, "queuerId" uuid, CONSTRAINT "PK_4adefbd9c73b3f9a49985a5529f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "queue" ADD CONSTRAINT "FK_a312ee52215cfeffe9fe70e68fb" FOREIGN KEY ("queuerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queue" DROP CONSTRAINT "FK_a312ee52215cfeffe9fe70e68fb"`);
        await queryRunner.query(`DROP TABLE "queue"`);
    }

}
