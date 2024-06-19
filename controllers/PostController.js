const Post = require("../models/Post");
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const User = require('../models/User');

mongoose.connect(process.env.MONG0DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1' 
});

const sqs = new AWS.SQS();

const QUEUE_URL = process.env.QUEUE_URL;
class PostController{

  async createPost(req, res) {
    try {
      const { userId, content } = req.body;
      const post = new Post({ userId, content });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async updatePost(req, res) {
    try {
      const { postId, content } = req.body;
      const post = await Post.findByIdAndUpdate(postId, { content }, { new: true });
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  async deletePost(req, res) {
    try {
      const { postId } = req.body;
      await Post.findByIdAndDelete(postId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async likePost(req, res) {
    try {
      const { postId, userId } = req.body;
      const post = await Post.findById(postId);
      post.likes.push(userId);
      await post.save();
     const params = {
      MessageBody: JSON.stringify({ postId, userId, type: 'like' }),
      QueueUrl: QUEUE_URL,
      MessageGroupId: '1234',
   };
    await sqs.sendMessage(params).promise();
     res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }


  async savePost(req, res) {
    try {
      const { postId, userId } = req.body;
      const post = await Post.findById(postId);
      post.saves.push(userId);
      await post.save();
      const params = {
        MessageBody: JSON.stringify({ postId, userId, type: 'save' }),
        QueueUrl: QUEUE_URL,
        MessageGroupId: '1234',
      };
      await sqs.sendMessage(params).promise();
    
      res.status(200).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
}
module.exports = PostController