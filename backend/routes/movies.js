import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.get('/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .findOneBy({ id: req.params.id })
    .then(function (movie) {
      if (movie === null) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.json({ movie: movie });
      }
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const tmdbId = req.body.tmdbId || req.body.id;
  const title = req.body.title || req.body.name;

  if (tmdbId === undefined || title === undefined) {
    res.status(400).json({
      message: 'tmdbId and title are required',
    });

    return;
  }

  const newMovie = movieRepository.create({
    tmdbId: tmdbId,
    title: title,
    release_date:
      req.body.release_date || req.body.releaseDate || req.body.date,
    poster_path: req.body.poster_path || req.body.posterPath,
    overview: req.body.overview,
  });

  movieRepository
    .insert(newMovie)
    .then(function () {
      res.status(201).json({
        message: 'Movie successfully created',
        movie: newMovie,
      });
    })
    .catch(function (error) {
      console.error(error);

      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(409).json({
          message: 'Movie already exists',
        });

        return;
      }

      res.status(500).json({
        message: 'Error while creating the movie',
      });
    });
});

router.delete('/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.id })
    .then(function (result) {
      if (result.affected === 0) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.status(204).json({ message: 'Movie successfully deleted' });
      }
    });
});

export default router;
