import {MigrationInterface, QueryRunner} from "typeorm";

export class projectpermz1622045338356 implements MigrationInterface {
    name = 'projectpermz1622045338356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "project_permission_type_enum" AS ENUM('SUPER_USER')`);
        await queryRunner.query(`CREATE TABLE "project_permission" ("description" character varying NOT NULL, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" "project_permission_type_enum" NOT NULL, CONSTRAINT "PK_a65708de1faa2bf2c27fc778f0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_membership" ("id" SERIAL NOT NULL, "selected" boolean NOT NULL DEFAULT false, "accountId" character varying, "projectId" integer, CONSTRAINT "PK_014d8d8717bd042113ffac67159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_membership_permissions_project_permission" ("projectMembershipId" integer NOT NULL, "projectPermissionId" integer NOT NULL, CONSTRAINT "PK_e84fef4b24e61be1a91147f4142" PRIMARY KEY ("projectMembershipId", "projectPermissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_50aa8e9d6bb46d9d45fbf8fb40" ON "project_membership_permissions_project_permission" ("projectMembershipId") `);
        await queryRunner.query(`CREATE INDEX "IDX_82a58adc9e62d7d9921ec47736" ON "project_membership_permissions_project_permission" ("projectPermissionId") `);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_edce060eab501ce02c7da0ec611" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership" ADD CONSTRAINT "FK_64f251ee61ba7531396f34ba8af" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" ADD CONSTRAINT "FK_50aa8e9d6bb46d9d45fbf8fb409" FOREIGN KEY ("projectMembershipId") REFERENCES "project_membership"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" ADD CONSTRAINT "FK_82a58adc9e62d7d9921ec47736f" FOREIGN KEY ("projectPermissionId") REFERENCES "project_permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" DROP CONSTRAINT "FK_82a58adc9e62d7d9921ec47736f"`);
        await queryRunner.query(`ALTER TABLE "project_membership_permissions_project_permission" DROP CONSTRAINT "FK_50aa8e9d6bb46d9d45fbf8fb409"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_64f251ee61ba7531396f34ba8af"`);
        await queryRunner.query(`ALTER TABLE "project_membership" DROP CONSTRAINT "FK_edce060eab501ce02c7da0ec611"`);
        await queryRunner.query(`DROP INDEX "IDX_82a58adc9e62d7d9921ec47736"`);
        await queryRunner.query(`DROP INDEX "IDX_50aa8e9d6bb46d9d45fbf8fb40"`);
        await queryRunner.query(`DROP TABLE "project_membership_permissions_project_permission"`);
        await queryRunner.query(`DROP TABLE "project_membership"`);
        await queryRunner.query(`DROP TABLE "project_permission"`);
        await queryRunner.query(`DROP TYPE "project_permission_type_enum"`);
    }

}
