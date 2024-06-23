"use client";
import {
  Box,
  FormControl,
  IconButton,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Bubble, BubbleProps } from "./ui/Bubble";
import { ChatInput } from "./ui/ChatInput";
import { useEffect, useState } from "react";
import { ChatData, Message, getChatData, sendMessage } from "./lib/chatapi";
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CHAT_KEY = "chat";
export default function Home() {
  const [chatId, setChatId] = useState<string>();
  const user = "guest";
  const [chat, setChat] = useState<ChatData>();
  const [text, setText] = useState<string>();

  useEffect(() => {
    const _chatId = localStorage.getItem(CHAT_KEY);

    getChatData(
      _chatId
        ? `http://localhost:8000/chat/${_chatId}`
        : "http://localhost:8000/chat/create/0"
    ).then((data) => {
      setChat(data);
      setChatId(data.id);
      localStorage.setItem(CHAT_KEY, data.id);
    });
  },[]);

  const mapSenderType = (
    sender: Message["sender_type"]
  ): BubbleProps["type"] => {
    switch (sender) {
      case "user":
        return "sent";
      case "system":
        return "system";
      case "confidant":
        return "received";
    }
  };

  return (
    <main className="flex flex-col flex-1 h-full">
      <Box className="flex-grow mt-2">
        {!!chat &&
          chat.messages.map((i) => (
            <Bubble
              content={i.content}
              type={mapSenderType(i.sender_type)}
            ></Bubble>
          ))}
      </Box>

      <ChatInput
        text={text}
        onTextChange={setText}
        onSend={() => {
          if (chatId && text) {
            sendMessage("http://localhost:8000/chat/", {
              chat_id: chatId,
              content: text,
              sender_type: "user",
              sender: user,
            });
          }
        }}
      />
    </main>
  );
}
