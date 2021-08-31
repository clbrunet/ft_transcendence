import {MigrationInterface, QueryRunner} from "typeorm";

export class migr21630395966624 implements MigrationInterface {
    name = 'migr21630395966624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "block" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blockConnectorId" uuid, "blockId" uuid, CONSTRAINT "UQ_5e33ff1aac4540a4a6681466dec" UNIQUE ("blockConnectorId", "blockId"), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_98dccc911463b56421a48e8f3ac" FOREIGN KEY ("blockConnectorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_5bdbcadcef3f691fa37dc0ec0cf" FOREIGN KEY ("blockId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_5bdbcadcef3f691fa37dc0ec0cf"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_98dccc911463b56421a48e8f3ac"`);
        await queryRunner.query(`DROP TABLE "block"`);
    }

}
