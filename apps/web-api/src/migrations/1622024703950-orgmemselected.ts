import {MigrationInterface, QueryRunner} from "typeorm";

export class orgmemselected1622024703950 implements MigrationInterface {
    name = 'orgmemselected1622024703950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD "selected" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP COLUMN "selected"`);
    }

}
