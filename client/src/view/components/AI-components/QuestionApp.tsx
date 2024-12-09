import React, { useEffect, useRef, useState } from "react";
import "./AI-components.scss";
import AIResponse from "./AIResponse";
import Authorization from "../users/Authorization";
import { Message } from "../../../models/chatModel";
import { getMessages } from "../../../controllers/getMessages";
import { useUser } from "../../../contexts/UserContext";
import TextInput from "./TextInput";

const QuestionApp = () => {
  const { user } = useUser();
  const [chats, setChats] = useState<Message[]>([]);
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [inputText, setInputText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatId = location.pathname.split("/").pop();
    if (chatId && location.pathname.startsWith("/chats")) {
      getMessages(chatId).then((data) => {
        setChats(data);
      });
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", 
      });
    }
  }, [chats]);

  const handleSendQuestion = async () => {
    if (!inputText.trim())
      return alert("Please enter a question before sending.");

    const newMessage: Message = {
      question: inputText,
      answer: "",
      file: file ? { ...file } : undefined,
    };

    setChats((prev) => [...prev, newMessage]);
    setInputText("");
    const inputField = document.querySelector(".text-input-field");
    if (inputField) inputField.textContent = "";

    try {
      if (user) {
        const chatId = location.pathname.startsWith("/chats")
          ? location.pathname.split("/").pop()
          : null;

        if (!chatId) {
          const response = await fetch("/api/users/createChat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: inputText, fileContent: file?.content || "" }),
          });

          if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

          const newChat = await response.json();
          window.location.href = `/chats/${newChat._id}`;
        } else {
          const response = await fetch("/api/users/addMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: inputText,
              fileContent: file?.content || "",
              chatId,
            }),
          });

          if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

          const data = await response.json();

          setChats((prev) =>
            prev.map((chat) =>
              chat._id === data.message._id ? { ...chat, answer: data.savedMessage.answer } : chat
            )
          );
        }
      } else {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: inputText, fileContent: file?.content || "" }),
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        setChats((prev) =>
          prev.map((chat, index) =>
            index === prev.length - 1 ? { ...chat, answer: data.answer } : chat
          )
        );
      }
    } catch (error) {
      console.error("Error fetching answer:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const uploadedFile = event.target.files[0];
    if (uploadedFile.type !== "text/plain") {
      alert("Please upload a valid .txt file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        setFile({
          name: uploadedFile.name,
          content: e.target.result as string,
        });
      }
    };
    reader.readAsText(uploadedFile);
    event.target.value = "";
  };

  const handleClearFile = () => setFile(null);

  return (
    <div className="question-app">
      <div className="question-app__header">
        <Authorization />
      </div>

      <div className="question-app__container">
        <div className="chat-display" ref={chatContainerRef}>
          {chats.map((chat, index) => (
            <div key={index} className="chat-message">
              <div className="question-bubble">{chat.question}</div>
              {chat.answer && <AIResponse responseText={chat.answer} />}
            </div>
          ))}
        </div>
      </div>

      <div className="text-input">
        <TextInput
          onSend={handleSendQuestion}
          inputText={inputText}
          setInputText={setInputText}
        />
        <div className="file-upload">
          {file ? (
            <div className="file-info">
              <button onClick={handleClearFile}>
                <i className="bx bxs-trash" style={{ color: "#ffffff" }}></i>
              </button>
              <p>{file.name}</p>
            </div>
          ) : (
            <>
              <button>
                <label htmlFor="file-input" title="Attach a .txt file">
                  <i className="bx bx-paperclip"></i>
                </label>
              </button>
              <input
                type="file"
                accept=".txt"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </>
          )}
          <button onClick={handleSendQuestion}>
            <i className="bx bx-play"></i>
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default QuestionApp;
