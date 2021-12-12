import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1639295211427 implements MigrationInterface {
    name = 'migration1639295211427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE "users_id_seq"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" INT DEFAULT nextval('"users_id_seq"') NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "avatarUrl" varchar(2000) NOT NULL, "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now(), "projectId" int8, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_67689993ed1578f83ebf1b9078" ON "users" ("projectId") `);
        await queryRunner.query(`CREATE SEQUENCE "project_id_seq"`);
        await queryRunner.query(`CREATE TABLE "project" ("id" INT DEFAULT nextval('"project_id_seq"') NOT NULL, "name" varchar NOT NULL, "url" varchar, "description" string, "category" varchar NOT NULL, "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE "issue_id_seq"`);
        await queryRunner.query(`CREATE TABLE "issue" ("id" INT DEFAULT nextval('"issue_id_seq"') NOT NULL, "title" varchar NOT NULL, "type" varchar NOT NULL, "status" varchar NOT NULL, "priority" varchar NOT NULL, "listPosition" float8 NOT NULL, "description" string, "descriptionText" string, "estimate" int8, "timeSpent" int8, "timeRemaining" int8, "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now(), "reporterId" int8 NOT NULL, "projectId" int8 NOT NULL, CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be30b91466b730c5e25f1181f7" ON "issue" ("projectId") `);
        await queryRunner.query(`CREATE SEQUENCE "comment_id_seq"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" INT DEFAULT nextval('"comment_id_seq"') NOT NULL, "body" string NOT NULL, "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now(), "userId" int8 NOT NULL, "issueId" int8 NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0354a9a009d3bb45a08655ce3" ON "comment" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c91b5a63310845bdeca63d9ee1" ON "comment" ("issueId") `);
        await queryRunner.query(`CREATE TABLE "issue_users_users" ("issueId" int8 NOT NULL, "usersId" int8 NOT NULL, CONSTRAINT "PK_c361af51055dd452d91826d63c8" PRIMARY KEY ("issueId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_43349fd9784640b82b72c6dc1f" ON "issue_users_users" ("issueId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d7736ebe3249a3e6dc42f493a7" ON "issue_users_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_67689993ed1578f83ebf1b90781" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_be30b91466b730c5e25f1181f79" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c91b5a63310845bdeca63d9ee13" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_users_users" ADD CONSTRAINT "FK_43349fd9784640b82b72c6dc1f9" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_users_users" ADD CONSTRAINT "FK_d7736ebe3249a3e6dc42f493a7d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issue_users_users" DROP CONSTRAINT "FK_d7736ebe3249a3e6dc42f493a7d"`);
        await queryRunner.query(`ALTER TABLE "issue_users_users" DROP CONSTRAINT "FK_43349fd9784640b82b72c6dc1f9"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c91b5a63310845bdeca63d9ee13"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_be30b91466b730c5e25f1181f79"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_67689993ed1578f83ebf1b90781"`);
        await queryRunner.query(`DROP INDEX "issue_users_users"@"IDX_d7736ebe3249a3e6dc42f493a7" CASCADE`);
        await queryRunner.query(`DROP INDEX "issue_users_users"@"IDX_43349fd9784640b82b72c6dc1f" CASCADE`);
        await queryRunner.query(`DROP TABLE "issue_users_users"`);
        await queryRunner.query(`DROP INDEX "comment"@"IDX_c91b5a63310845bdeca63d9ee1" CASCADE`);
        await queryRunner.query(`DROP INDEX "comment"@"IDX_c0354a9a009d3bb45a08655ce3" CASCADE`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP SEQUENCE "comment_id_seq"`);
        await queryRunner.query(`DROP INDEX "issue"@"IDX_be30b91466b730c5e25f1181f7" CASCADE`);
        await queryRunner.query(`DROP TABLE "issue"`);
        await queryRunner.query(`DROP SEQUENCE "issue_id_seq"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP SEQUENCE "project_id_seq"`);
        await queryRunner.query(`DROP INDEX "users"@"IDX_67689993ed1578f83ebf1b9078" CASCADE`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP SEQUENCE "users_id_seq"`);
    }

}
