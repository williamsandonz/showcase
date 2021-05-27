import {MigrationInterface, QueryRunner} from "typeorm";

export class projectz1622043284547 implements MigrationInterface {
    name = 'projectz1622043284547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "organisationId" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
