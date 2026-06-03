/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddRecomandation1780477922446 {
    name = 'AddRecomandation1780477922446'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "recommandation" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "score" float NOT NULL,
                "ranking" integer NOT NULL,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "rating_value" integer NOT NULL,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"("id", "email")
            SELECT "id",
                "email"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "nickname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user"("id", "email")
            SELECT "id",
                "email"
            FROM "user"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user"
                RENAME TO "user"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_recommandation" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "score" float NOT NULL,
                "ranking" integer NOT NULL,
                CONSTRAINT "FK_626cff90b813090aed457705392" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_64324ba5c373cd58aeb40eb692e" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_recommandation"("user_id", "movie_id", "score", "ranking")
            SELECT "user_id",
                "movie_id",
                "score",
                "ranking"
            FROM "recommandation"
        `);
        await queryRunner.query(`
            DROP TABLE "recommandation"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_recommandation"
                RENAME TO "recommandation"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_rating" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "rating_value" integer NOT NULL,
                CONSTRAINT "FK_17618c8d69b7e2e287bf9f8fbb3" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_a6341c958bc0027bfb37b0f98a4" FOREIGN KEY ("movie_id") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_rating"("user_id", "movie_id", "rating_value")
            SELECT "user_id",
                "movie_id",
                "rating_value"
            FROM "rating"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_rating"
                RENAME TO "rating"
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "rating"
                RENAME TO "temporary_rating"
        `);
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "rating_value" integer NOT NULL,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "rating"("user_id", "movie_id", "rating_value")
            SELECT "user_id",
                "movie_id",
                "rating_value"
            FROM "temporary_rating"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_rating"
        `);
        await queryRunner.query(`
            ALTER TABLE "recommandation"
                RENAME TO "temporary_recommandation"
        `);
        await queryRunner.query(`
            CREATE TABLE "recommandation" (
                "user_id" integer NOT NULL,
                "movie_id" integer NOT NULL,
                "score" float NOT NULL,
                "ranking" integer NOT NULL,
                PRIMARY KEY ("user_id", "movie_id")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "recommandation"("user_id", "movie_id", "score", "ranking")
            SELECT "user_id",
                "movie_id",
                "score",
                "ranking"
            FROM "temporary_recommandation"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_recommandation"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"("id", "email")
            SELECT "id",
                "email"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME TO "temporary_user"
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user"("id", "email")
            SELECT "id",
                "email"
            FROM "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user"
        `);
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
        await queryRunner.query(`
            DROP TABLE "recommandation"
        `);
    }
}
