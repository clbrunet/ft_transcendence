import {MigrationInterface, QueryRunner} from "typeorm";

export class myThird1626697468719 implements MigrationInterface {
    name = 'myThird1626697468719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar_path" SET DEFAULT '../assets/default_avatar.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "avatar_path" DROP DEFAULT`);
    }

}
