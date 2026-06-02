import typeorm from 'typeorm';

const { MigrationInterface, QueryRunner } = typeorm;

export default class UpdateMovieTableForTmdb1717330100000 {
    name = 'UpdateMovieTableForTmdb1717330100000';

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "tmdbId" integer NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "overview" text,
                CONSTRAINT "UQ_movie_tmdbId" UNIQUE ("tmdbId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie" ("id", "tmdbId", "title", "release_date")
            SELECT "id", "id", "name", "date"
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie" RENAME TO "movie"
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "temporary_movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "date" varchar NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie" ("id", "name", "date")
            SELECT "id", "title", COALESCE("release_date", '')
            FROM "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie" RENAME TO "movie"
        `);
    }
}
