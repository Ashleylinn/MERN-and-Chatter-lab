import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export default {
  async register(req, res) {
    try {
      const {username, password} = req.body;
      // TODO: Implement the user registration
      const userExists = await User.findOne({ where: { username } }); 
      if(userExists){
        return res.status(400).json({ error: 'The username is already taken.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, hash: hashedPassword });
      req.session.username = username;
      res.status(201).json({ message: 'The user has been successfully registered.' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred while registering the user.'
      });
    }
  },

  async login(req, res) {
    try {
      const {username, password} = req.body;
      // TODO: Implement the user login

      const user = await User.findOne({ where: { username } }); 
      if(!user){
        return res.status(401).json({ error: 'The username/password is incorrect' });
      }

      const pw = await bcrypt.compare(password, user.hash);
      if(!pw){
        return res.status(401).json({ error: 'The username/password is incorrect.' });
      }
      
      req.session.userId = user.id;
      req.session.username = username;
      res.status(201).json({ message: 'Logged in successfully' });
    
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred while logging in.'
      });
    }
  },

  async logout(req, res) {
    try {
      req.session.destroy();
      res.status(200).json({
        message: 'The user has been logged out.',
      });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred while logging out.'
      });
    }
  },

  async me(req, res) {
    try {
      // TODO: Implement the retrieval of the currently logged in user's username
      const { userId, username } = req.session;
      if(!username || !userId ){
        return res.status(401).json({ error: 'User not authenticated' });
      }
      res.status(200).json({ id: userId, username: username });
    }
    catch(err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred while retrieving the user.'
      });
    }
  }
}