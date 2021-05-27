import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1621345046860 implements MigrationInterface {
    name = 'initial1621345046860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "organisation_permission_type_enum" AS ENUM('SUPER_USER')`);
        await queryRunner.query(`CREATE TABLE "organisation_permission" ("description" character varying NOT NULL, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "organisation_permission_type_enum" NOT NULL, CONSTRAINT "PK_89aa5bf9c13fa4a8856d6e2710b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_membership" ("id" SERIAL NOT NULL, "organisationId" integer, "accountId" character varying, CONSTRAINT "PK_fc3213e972ff7b613ebc1833264" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("cookieUsageEnabled" boolean, "id" character varying NOT NULL, "dateJoined" TIMESTAMP NOT NULL, "lastLoggedIn" TIMESTAMP NOT NULL, "name" character varying NOT NULL, "stripeCustomerId" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "demo" ("id" SERIAL NOT NULL, "foo" character varying NOT NULL, CONSTRAINT "PK_9d8d89f7764de19ec5a40a5f056" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_membership_permissions_organisation_permission" ("organisationMembershipId" integer NOT NULL, "organisationPermissionId" integer NOT NULL, CONSTRAINT "PK_5225e1fda0db9a760932a3a3c38" PRIMARY KEY ("organisationMembershipId", "organisationPermissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_633cf4376d6cbd62a31c657667" ON "organisation_membership_permissions_organisation_permission" ("organisationMembershipId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d5026c91df6286a3428bba843" ON "organisation_membership_permissions_organisation_permission" ("organisationPermissionId") `);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_3be38f1dacbe189d169072d24c1" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" ADD CONSTRAINT "FK_633cf4376d6cbd62a31c6576671" FOREIGN KEY ("organisationMembershipId") REFERENCES "organisation_membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" ADD CONSTRAINT "FK_3d5026c91df6286a3428bba8435" FOREIGN KEY ("organisationPermissionId") REFERENCES "organisation_permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" DROP CONSTRAINT "FK_3d5026c91df6286a3428bba8435"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" DROP CONSTRAINT "FK_633cf4376d6cbd62a31c6576671"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_3be38f1dacbe189d169072d24c1"`);
        await queryRunner.query(`DROP INDEX "IDX_3d5026c91df6286a3428bba843"`);
        await queryRunner.query(`DROP INDEX "IDX_633cf4376d6cbd62a31c657667"`);
        await queryRunner.query(`DROP TABLE "organisation_membership_permissions_organisation_permission"`);
        await queryRunner.query(`DROP TABLE "demo"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "organisation_membership"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
        await queryRunner.query(`DROP TABLE "organisation_permission"`);
        await queryRunner.query(`DROP TYPE "organisation_permission_type_enum"`);
    }

}
