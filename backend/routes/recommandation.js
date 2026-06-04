import express from 'express';
import { appDataSource } from '../datasource.js';
import Recommandation from '../entities/recommandation.js';

const router = express.Router();

router.get('/:user_id', function (req, res) {
  appDataSource
    .getRepository(Recommandation)
    .find({
      where: { user_id: parseInt(req.params.user_id) },
      order: { ranking: 'ASC' },
      relations: ['movie', 'movie.genres'],
    })
    .then(function (recommandations) {
      if (recommandations === null) {
        res.status(404).json({ message: 'Recommandation not found' });
      } else {
        res.json({ recommandations });
      }
    });
});

export default router;
