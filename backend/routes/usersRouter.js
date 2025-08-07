import express from 'express';
import usersController from '../controllers/usersController.js';

export const usersRouter = express.Router();

usersRouter.post('/register', usersController.register);
usersRouter.post('/login', usersController.login);
usersRouter.get('/me', usersController.me);
usersRouter.delete('/logout', usersController.logout);