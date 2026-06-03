import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/ratings.js';

const router = express.Router();

router.get('/', function (req, res) {
  const userId = req.query.user_id;

  if (userId === undefined) {
    res.status(400).json({
      message: 'user_id is required',
    });

    return;
  }

  appDataSource
    .getRepository(Rating)
    .findBy({ user_id: Number(userId) })
    .then(function (ratings) {
      res.json({ ratings: ratings });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching ratings' });
    });
});

router.post('/', function (req, res) {
  const ratingRepository = appDataSource.getRepository(Rating);
  const rating = ratingRepository.create({
    user_id: req.body.user_id,
    movie_id: req.body.movie_id,
    rating_value: req.body.rating_value,
  });

  if (
    rating.user_id === undefined ||
    rating.movie_id === undefined ||
    rating.rating_value === undefined
  ) {
    res.status(400).json({
      message: 'user_id, movie_id and rating_value are required',
    });

    return;
  }

  ratingRepository
    .save(rating)
    .then(function () {
      res.status(201).json({
        message: 'Rating successfully saved',
        rating: rating,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while saving the rating' });
    });
});

export default router;
