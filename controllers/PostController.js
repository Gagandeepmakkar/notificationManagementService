const Post = require("../models/Post");
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const User = require('../models/User');

mongoose.connect('mongodb+srv://22gaganld:22gaganld@demo.lgslbjd.mongodb.net/NotificationManagement?retryWrites=true&w=majority&appName=Demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


AWS.config.update({
  accessKeyId: 'AKIA4MTWKXPAB3K55BAK',
  secretAccessKey: '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',
  region: 'us-east-1' 
});

const sqs = new AWS.SQS();

const QUEUE_URL = 'https://sqs.eu-north-1.amazonaws.com/851725433792/NotificationService.fifo';
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