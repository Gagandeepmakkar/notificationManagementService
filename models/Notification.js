const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: { type: String, ref: 'User' },
  postId: { type: String, ref: 'Post' },
  type: String,
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model('Notification', NotificationSchema);
