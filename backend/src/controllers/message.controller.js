import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getReceiverSocketId } from "../../server.js";
import { io } from "../../server.js";

// ─── GET ALL USERS EXCEPT LOGGED IN USER ───
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // get everyone except yourself
    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SEND MESSAGE ───
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // find existing conversation between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // if no conversation exists → create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // create the message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message,
    });

    // update lastMessage in conversation
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // ─── REAL TIME DELIVERY VIA SOCKET ───
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // receiver is online → send message instantly
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET MESSAGES WITH A SPECIFIC USER ───
export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    // find conversation between these two
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // no conversation yet → return empty array
    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    // get all messages in this conversation, oldest first
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};