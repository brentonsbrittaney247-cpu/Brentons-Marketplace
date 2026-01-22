const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get messages for a listing
router.get('/listing/:listingId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      listing: req.params.listingId,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
      .populate('sender', 'username profilePhoto')
      .populate('receiver', 'username profilePhoto')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, receiverId, content } = req.body;

    const message = new Message({
      listing: listingId,
      sender: req.user._id,
      receiver: receiverId,
      content
    });

    await message.save();
    await message.populate('sender', 'username profilePhoto');
    await message.populate('receiver', 'username profilePhoto');

    // Emit via Socket.IO (handled in server/index.js)
    req.app.get('io').to(receiverId.toString()).emit('new-message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message || message.receiver.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
