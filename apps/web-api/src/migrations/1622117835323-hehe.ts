import {MigrationInterface, QueryRunner} from "typeorm";

export class hehe1622117835323 implements MigrationInterface {
    name = 'hehe1622117835323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_3be38f1dacbe189d169072d24c1"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ALTER COLUMN "accountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ALTER COLUMN "organisationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "organisationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_edce060eab501ce02c7da0ec611"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_64f251ee61ba7531396f34ba8af"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ALTER COLUMN "accountId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_membership" ALTER COLUMN "projectId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_3be38f1dacbe189d169072d24c1" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_edce060eab501ce02c7da0ec611" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_64f251ee61ba7531396f34ba8af" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_64f251ee61ba7531396f34ba8af"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_edce060eab501ce02c7da0ec611"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_3be38f1dacbe189d169072d24c1"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8"`);
        await queryRunner.query(`ALTER TABLE "project_membership" ALTER COLUMN "projectId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_membership" ALTER COLUMN "accountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_64f251ee61ba7531396f34ba8af" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_edce060eab501ce02c7da0ec611" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "organisationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ALTER COLUMN "organisationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ALTER COLUMN "accountId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_3be38f1dacbe189d169072d24c1" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
