import express from 'express';
import User from '../entities/user.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

router.get('/users', function (req, res) {
  appDataSource
    .getRepository(User)
    .find()
    .then(function (users) {
      res.json({ users });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching users' });
    });
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);

  const newUser = userRepository.create({
    email: req.body.email,
    nickname: req.body.nickname,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'Dev user successfully created',
        user: savedUser,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while creating dev user' });
    });
});

export default router;
