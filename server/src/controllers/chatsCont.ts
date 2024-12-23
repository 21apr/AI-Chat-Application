import { UserModel } from "../models/users/UserModel";
import { ChatModel, FileModel, MessageModel } from "./../models/chats/ChatModel";
import { getAnswerFromOpenAI, getChatName } from "./aiService";

export async function addMessage(req: any, res: any) {
  try {
    const userId = req.userId;
    let { chatId, question, file } = req.body;

    let fileContent = "";
    let newFileId = null;

    if (file) {
      const newFile = await FileModel.create({
        name: file.name,
        content: file.content
      })
      await newFile.save();
      fileContent = newFile.content as string;
      newFileId = newFile._id
    }

    let chatServer = await ChatModel.findOne({ _id: chatId });
    if (!chatId) {
      const newChat = await ChatModel.create({
        name: await getChatName(question, fileContent),
        user: userId,
      })
      chatId = newChat._id;
      chatServer = newChat;
    }

    if (newFileId && chatServer) {
      chatServer.file = newFileId;
      await chatServer.save();
      console.log("All works")
    }

    // console.log("addMessage request", chatId, question)
    const answer = await getAnswerFromOpenAI(question, fileContent);

    if (!answer) {
      res.status(500).json({ message: "Unable to get a response from OpenAI." });
      return;
    }

    const savedMessage = await saveMessage(chatId, question, answer, file);
    // console.log("addMessage", savedMessage)
    res.status(200).json({ message: "Message saved successfully", savedMessage, chatServer });
  } catch (error) {
    console.error("Error in addMessage:", error);
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
}

export async function saveMessage(chatId: string, question: string, answer: string, file?: { name: string; content: string }) {
  const chat = await ChatModel.findOne({ _id: chatId });
  // console.log("chat", chat)

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
  } else {
    throw new Error("Chat not found");
  }
}

export async function getMessages(req: any, res: any) {
  const { chatId } = req.params;
  // console.log("getMessages", chatId)

  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await MessageModel.find({ chat: chatId });
    // console.log("messages", messages)
    console.log("getMessages", chat)
    const file = await FileModel.findById(chat.file);
    console.log("getMessages file", file)
    const fileName = file ? file.name : "";
    console.log("fileName", fileName)
    if (!messages) {
      return res.status(404).json({ message: "Messages not found" });
    }

    res.status(200).json({ messages: messages, file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export async function deleteFile(req: any, res: any) {
  const { chatId } = req.params;
  try {
    const chat = await ChatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const file = await FileModel.findById(chat.file);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    await FileModel.findByIdAndDelete(file._id);
    chat.file = null;
    await chat.save();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting file" });
  }
};