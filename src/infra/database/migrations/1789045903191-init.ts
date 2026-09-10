import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1789045903191 implements MigrationInterface {
    name = 'Init1789045903191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_user_ai_services_userId"`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_user_ai_services_aiServiceId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_ai_services_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_ai_services_aiServiceId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(10) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`CREATE INDEX "IDX_536012e84d626fcef88c3fde42" ON "user_ai_services" ("aiServiceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_675dd5b4ff2459bda141068dd4" ON "user_ai_services" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_536012e84d626fcef88c3fde427" FOREIGN KEY ("aiServiceId") REFERENCES "ai_services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_675dd5b4ff2459bda141068dd46" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_675dd5b4ff2459bda141068dd46"`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" DROP CONSTRAINT "FK_536012e84d626fcef88c3fde427"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_675dd5b4ff2459bda141068dd4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_536012e84d626fcef88c3fde42"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE INDEX "IDX_user_ai_services_aiServiceId" ON "user_ai_services" ("aiServiceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_ai_services_userId" ON "user_ai_services" ("userId") `);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_user_ai_services_aiServiceId" FOREIGN KEY ("aiServiceId") REFERENCES "ai_services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_ai_services" ADD CONSTRAINT "FK_user_ai_services_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
