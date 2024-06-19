const express = require('express');
const bodyParser = require('body-parser');
const PostController = require("./controllers/PostController")
const postController = new PostController();

const app = express();
app.use(bodyParser.json());
require('dotenv').config();

const PORT = process.env.PORT;

app.post('/posts/create', (req, res) => postController.createPost(req, res));
app.put('/posts/update', (req, res) => postController.updatePost(req, res));
app.delete('/posts/delete', (req, res) => postController.deletePost(req, res));
app.post('/posts/like', (req, res) => postController.likePost(req, res));
app.post('/posts/save', (req, res) => postController.savePost(req, res));

app.listen(PORT, () => {
  console.log(`Notification Delivery Service running on port ${PORT}`);
});
