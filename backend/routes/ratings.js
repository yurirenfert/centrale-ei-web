import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/ratings.js';

const router = express.Router();

router.get('/:user_id/:movie_id', function (req, res) {
  appDataSource
    .getRepository(Rating)
    .findOneBy({ user_id: req.params.user_id, movie_id: req.params.movie_id })
    .then(function (rating) {
      if (rating === null) {
        res.status(404).json({ message: 'Rating not found' });
      } else {
        res.json({ rating: rating });
      }
    });
});

router.post('/new', async function (req, res) {
  const ratingRepository = appDataSource.getRepository(Rating);
  const userId = req.body.user_id;
  const movieId = req.body.movie_id;
  const ratingValue = req.body.rating_value;

  if (
    userId === undefined ||
    movieId === undefined ||
    ratingValue === undefined
  ) {
    res.status(400).json({
      message: 'userId, movieId and ratingValue are required',
    });

    return;
  }

  if (ratingValue !== -1 && ratingValue !== 1) {
    res.status(400).json({
      message: 'ratingValue must be either -1 or 1',
    });

    return;
  }

  try {
    const existing = await ratingRepository.findOneBy({
      user_id: userId,
      movie_id: movieId,
    });
    if (existing) {
      // remove previous rating first to avoid UNIQUE/constraint races
      await ratingRepository.delete({ user_id: userId, movie_id: movieId });
      console.log(
        `Existing rating found for user ${userId} and movie ${movieId}, replaced.`
      );
    }

    const newRating = ratingRepository.create({
      user_id: userId,
      movie_id: movieId,
      rating_value: ratingValue,
    });

    await ratingRepository.save(newRating);

    return res
      .status(201)
      .json({ message: 'Rating successfully created', rating: newRating });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Error creating rating' });
  }
});

export default router;
