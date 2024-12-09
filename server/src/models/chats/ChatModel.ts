import {Schema, model} from 'mongoose';

export const MessageSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  file: {
    name: { type: String },
    content: { type: String },
  },
});

export const ChatSchema = new Schema({
  name: { type: String },
  lastUpdated: { type: Date, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export const ChatModel = model("Chat", ChatSchema);
export const MessageModel = model("Message", MessageSchema);
