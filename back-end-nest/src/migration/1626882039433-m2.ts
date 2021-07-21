import {MigrationInterface, QueryRunner} from "typeorm";

export class m21626882039433 implements MigrationInterface {
    name = 'm21626882039433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "channel" DROP CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07"`);
        await queryRunner.query(`ALTER TABLE "channel" ADD CONSTRAINT "FK_bdfef605fedc02f3f9d60f1bc07" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
