import { UserModel } from "../models/users/UserModel";
import { ChatModel, MessageModel } from "./../models/chats/ChatModel";
import { getAnswerFromOpenAI, getChatName } from "./aiService";

export async function addMessage(req: any, res: any) {
  const { chatId, question, fileContent } = req.body;
  console.log("addMessage request", chatId, question)
  const answer = await getAnswerFromOpenAI(question, fileContent);

  if (!answer) {
    res.status(500).json({ message: "Unable to get a response from OpenAI." });
    return;
  }

  const savedMessage = await saveMessage(chatId, question, answer, fileContent);
  console.log("addMessage", savedMessage)
  res.status(200).json({ message: "Message saved successfully", savedMessage });
}

export async function saveMessage(chatId: string, question: string, answer: string, file?: { name: string; content: string }) {
  const chat = await ChatModel.findOne({ _id: chatId });
  console.log("chat", chat)

  if (chat) {
    const newMessage = await MessageModel.create({
      question,
      answer,
      file,
      chat: chat._id
    })

    chat.messages.push(newMessage._id);
    chat.lastUpdated = new Date();
    await chat.save();

    return newMessage;
  }
}

export async function setChat(req: any, res: any) {
  const  userId  = req.userId;
  const { question, fileContent } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const answer = await getAnswerFromOpenAI(question, fileContent);

    const chatName = await getChatName(question, fileContent);

    const newChat = await ChatModel.create({
      name: chatName,
      user: user._id
    });

    const newMessage = await MessageModel.create({
      question,
      answer,
      file: fileContent,
      user: user._id,
      chat: newChat._id
    });

    newChat.messages.push(newMessage._id);
    newChat.lastUpdated = new Date();
    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating chat" });
  }
};

export async function getMessages(req: any, res: any) {
  const  {chatId}  = req.params;
  console.log("getMessages", chatId)

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await MessageModel.find({ chat: chatId });
    console.log("messages", messages)
    if (!messages) {
      return res.status(404).json({ message: "Messages not found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};