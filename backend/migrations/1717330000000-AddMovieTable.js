import typeorm from 'typeorm';

const { MigrationInterface, QueryRunner } = typeorm;

export default class AddMovieTable1717330000000 {
  name = 'AddMovieTable1717330000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "movie" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "date" varchar NOT NULL
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DROP TABLE "movie"
    `);
  }
}
