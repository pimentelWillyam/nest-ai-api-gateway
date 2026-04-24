import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAiServicesRelation1776951395741 implements MigrationInterface {
    name = 'AddUserAiServicesRelation1776951395741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_ai_services" ("userId" uuid NOT NULL, "aiServiceId" uuid NOT NULL, CONSTRAINT "PK_1234567890abcdef" PRIMARY KEY ("userId", "aiServiceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_user_ai_services_userId" ON "user_ai_services" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_ai_services_aiServiceId" ON "user_ai_services" ("aiServiceId") `);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_user_ai_services_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_user_ai_services_aiServiceId" FOREIGN KEY ("aiServiceId") REFERENCES "ai_services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_user_ai_services_aiServiceId"`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_user_ai_services_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_ai_services_aiServiceId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_ai_services_userId"`);
        await queryRunner.query(`DROP TABLE "user_ai_services"`);
    }

}