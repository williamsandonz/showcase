import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1624374210372 implements MigrationInterface {
    name = 'initial1624374210372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("cookieUsageEnabled" boolean, "dateJoined" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "id" character varying NOT NULL, "lastLoggedIn" TIMESTAMP NOT NULL, "name" character varying NOT NULL, "stripeCustomerId" character varying NOT NULL, "timezone" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "demo" ("id" SERIAL NOT NULL, "foo" character varying NOT NULL, CONSTRAINT "PK_9d8d89f7764de19ec5a40a5f056" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_invitation" ("accepted" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "dateAccepted" TIMESTAMP, "dateInvited" TIMESTAMP NOT NULL, "id" SERIAL NOT NULL, "secret" character varying NOT NULL, "inviterId" character varying NOT NULL, "organisationId" integer NOT NULL, CONSTRAINT "PK_bc02758b572555c4ed7f27aa199" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "organisation_permission_type_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "organisation_permission" ("description" character varying NOT NULL, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "organisation_permission_type_enum" NOT NULL, CONSTRAINT "PK_89aa5bf9c13fa4a8856d6e2710b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_membership" ("id" SERIAL NOT NULL, "selected" boolean NOT NULL DEFAULT false, "accountId" character varying NOT NULL, "organisationId" integer NOT NULL, CONSTRAINT "PK_fc3213e972ff7b613ebc1833264" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "project_permission_type_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "project_permission" ("description" character varying NOT NULL, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "project_permission_type_enum" NOT NULL, CONSTRAINT "PK_a65708de1faa2bf2c27fc778f0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "organisationId" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_membership" ("id" SERIAL NOT NULL, "accountId" character varying NOT NULL, "projectId" integer NOT NULL, CONSTRAINT "PK_014d8d8717bd042113ffac67159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_membership_permissions_organisation_permission" ("organisationMembershipId" integer NOT NULL, "organisationPermissionId" integer NOT NULL, CONSTRAINT "PK_5225e1fda0db9a760932a3a3c38" PRIMARY KEY ("organisationMembershipId", "organisationPermissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_633cf4376d6cbd62a31c657667" ON "organisation_membership_permissions_organisation_permission" ("organisationMembershipId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d5026c91df6286a3428bba843" ON "organisation_membership_permissions_organisation_permission" ("organisationPermissionId") `);
        await queryRunner.query(`CREATE TABLE "project_membership_permissions_project_permission" ("projectMembershipId" integer NOT NULL, "projectPermissionId" integer NOT NULL, CONSTRAINT "PK_e84fef4b24e61be1a91147f4142" PRIMARY KEY ("projectMembershipId", "projectPermissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_50aa8e9d6bb46d9d45fbf8fb40" ON "project_membership_permissions_project_permission" ("projectMembershipId") `);
        await queryRunner.query(`CREATE INDEX "IDX_82a58adc9e62d7d9921ec47736" ON "project_membership_permissions_project_permission" ("projectPermissionId") `);
        await queryRunner.query(`ALTER TABLE "organisation_invitation" ADD CONSTRAINT "FK_7db5cc56cd43f7041931c12d8fe" FOREIGN KEY ("inviterId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_invitation" ADD CONSTRAINT "FK_db7d9e612349cb1b69c702d5d45" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" ADD CONSTRAINT "FK_3be38f1dacbe189d169072d24c1" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_edce060eab501ce02c7da0ec611" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_64f251ee61ba7531396f34ba8af" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" ADD CONSTRAINT "FK_633cf4376d6cbd62a31c6576671" FOREIGN KEY ("organisationMembershipId") REFERENCES "organisation_membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" ADD CONSTRAINT "FK_3d5026c91df6286a3428bba8435" FOREIGN KEY ("organisationPermissionId") REFERENCES "organisation_permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" ADD CONSTRAINT "FK_50aa8e9d6bb46d9d45fbf8fb409" FOREIGN KEY ("projectMembershipId") REFERENCES "project_membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" ADD CONSTRAINT "FK_82a58adc9e62d7d9921ec47736f" FOREIGN KEY ("projectPermissionId") REFERENCES "project_permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" DROP CONSTRAINT "FK_82a58adc9e62d7d9921ec47736f"`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" DROP CONSTRAINT "FK_50aa8e9d6bb46d9d45fbf8fb409"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" DROP CONSTRAINT "FK_3d5026c91df6286a3428bba8435"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership_permissions_organisation_permission" DROP CONSTRAINT "FK_633cf4376d6cbd62a31c6576671"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_64f251ee61ba7531396f34ba8af"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_edce060eab501ce02c7da0ec611"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9404c802186ca2b35576c9e4e0d"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_3be38f1dacbe189d169072d24c1"`);
        await queryRunner.query(`ALTER TABLE "organisation_membership" DROP CONSTRAINT "FK_ecde18a18d90b733e0827c28fe8"`);
        await queryRunner.query(`ALTER TABLE "organisation_invitation" DROP CONSTRAINT "FK_db7d9e612349cb1b69c702d5d45"`);
        await queryRunner.query(`ALTER TABLE "organisation_invitation" DROP CONSTRAINT "FK_7db5cc56cd43f7041931c12d8fe"`);
        await queryRunner.query(`DROP INDEX "IDX_82a58adc9e62d7d9921ec47736"`);
        await queryRunner.query(`DROP INDEX "IDX_50aa8e9d6bb46d9d45fbf8fb40"`);
        await queryRunner.query(`DROP TABLE "project_membership_permissions_project_permission"`);
        await queryRunner.query(`DROP INDEX "IDX_3d5026c91df6286a3428bba843"`);
        await queryRunner.query(`DROP INDEX "IDX_633cf4376d6cbd62a31c657667"`);
        await queryRunner.query(`DROP TABLE "organisation_membership_permissions_organisation_permission"`);
        await queryRunner.query(`DROP TABLE "project_membership"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "project_permission"`);
        await queryRunner.query(`DROP TYPE "project_permission_type_enum"`);
        await queryRunner.query(`DROP TABLE "organisation_membership"`);
        await queryRunner.query(`DROP TABLE "organisation_permission"`);
        await queryRunner.query(`DROP TYPE "organisation_permission_type_enum"`);
        await queryRunner.query(`DROP TABLE "organisation_invitation"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
        await queryRunner.query(`DROP TABLE "demo"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
