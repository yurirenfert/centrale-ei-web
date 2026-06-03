/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class CreationNewdb1780477230918 {
    name = 'CreationNewdb1780477230918'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
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
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "tmdbId" integer NOT NULL,
                "title" varchar NOT NULL,
                "release_date" varchar,
                "poster_path" varchar,
                "language" varchar,
                "overview" text,
                "background_path" varchar,
                "popularity" float,
                CONSTRAINT "UQ_e67ea82f6973f5b9a6747fba346" UNIQUE ("tmdbId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "genre" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                CONSTRAINT "FK_985216b45541c7e0ec644a8dd4e" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_1996ce31a9e067304ab168d6715" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_movie_genres_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genres_genre"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_movie_genres_genre"
                RENAME TO "movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            ALTER TABLE "movie_genres_genre"
                RENAME TO "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE TABLE "movie_genres_genre" (
                "movieId" integer NOT NULL,
                "genreId" integer NOT NULL,
                PRIMARY KEY ("movieId", "genreId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "movie_genres_genre"("movieId", "genreId")
            SELECT "movieId",
                "genreId"
            FROM "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_movie_genres_genre"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_1996ce31a9e067304ab168d671" ON "movie_genres_genre" ("genreId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_985216b45541c7e0ec644a8dd4" ON "movie_genres_genre" ("movieId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_1996ce31a9e067304ab168d671"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_985216b45541c7e0ec644a8dd4"
        `);
        await queryRunner.query(`
            DROP TABLE "movie_genres_genre"
        `);
        await queryRunner.query(`
            DROP TABLE "genre"
        `);
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
