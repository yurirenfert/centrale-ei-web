import express from 'express';
import { appDataSource } from '../datasource.js';
import Recommandation from '../entities/recommandation.js';

const router = express.Router();

router.get('/:user_id', function (req, res) {
  appDataSource
    .getRepository(Recommandation)
    .find({
      where: { user_id: req.params.user_id },
      order: { ranking: 'ASC' },
    })
    .then(function (recommandation) {
      if (recommandation === null) {
        res.status(404).json({ message: 'Recommandation not found' });
      } else {
        res.json({ recommandation: recommandation });
      }
    });
});

export default router;
