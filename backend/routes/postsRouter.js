import express from 'express';
import postsController from '../controllers/postsController.js';

export const postsRouter = express.Router();

postsRouter.post('/', postsController.createPost);
postsRouter.get('/', postsController.getPosts);