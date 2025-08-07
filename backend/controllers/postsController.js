import { Post } from "../models/post.js";
import { User } from "../models/user.js";

export default {
  async createPost(req, res) {
    try {
      const {content} = req.body;
      // TODO: Implement post creation
      const userId = req.session.userId;
      if(!userId){
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await Post.create({
        content, 
        authorId: userId,
        createAt: new Date()
      });

      res.status(201).json({ message: 'Post created successfully'})
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred during post creation.'
      });
    }
  },

  async getPosts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
      const offset = parseInt(req.query.offset) || 0;

      // Get paginated posts
      const { rows: posts, count } = await Post.findAndCountAll({
        include: {
          model: User,
          attributes: ['id', 'username']
        },
        limit,
        offset,
        order: [['id', 'DESC']] // Most recent posts first
      });

      const result = {
        posts: posts.map(post => {
          return {
            id: post.id,
            content: post.content,
            author: {
              id: post.user.id,
              username: post.user.username
            }
          }
        }),
        total: count,
      };

      res.status(200).json(result);
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred during post retrieval.'
      });
    }
  },
}