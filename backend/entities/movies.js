import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: { primary: true, type: Number, generated: true },
    tmdbId: { type: Number, unique: true },
    title: { type: String },
    release_date: { type: String, nullable: true },
    poster_path: { type: String, nullable: true },
    language: { type: String, nullable: true },
    overview: { type: 'text', nullable: true },
    background_path: { type: String, nullable: true },
    popularity: { type: 'float', nullable: true },
  },
  relations: {
    genres: {
      type: 'many-to-many',
      target: 'Genre',
      inverseSide: 'movies',
      joinTable: true,
    },
  },
});

export default Movie;
