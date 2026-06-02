import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    tmdbId: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
    },
    release_date: {
      type: String,
      nullable: true,
    },
    poster_path: {
      type: String,
      nullable: true,
    },
    overview: {
      type: 'text',
      nullable: true,
    },
  },
});

export default Movie;
