const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: { type: String, ref: 'User' },
  content: String,
  likes: [{ type: String, ref: 'User' }],
  saves: [{ type: String, ref: 'User' }],
});

module.exports = mongoose.model('Post', PostSchema);
