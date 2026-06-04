import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

router.get('/:userId/recommendations', function (req, res) {
  const userId = req.params.userId;

  // Pour commencer : fausse reco simple
  res.json({
    userId: userId,
    recommendations: [
      { id: 1, title: 'Inception' },
      { id: 2, title: 'Interstellar' },
    ],
  });
});

export default router;
