"use client";
import { Box, Container } from "@mui/material";
import { Bubble, BubbleProps } from "./ui/Bubble";
import { ChatInput } from "./ui/ChatInput";
import { useEffect, useRef, useState } from "react";
import { ChatData, Message, getChatData, sendMessage } from "./lib/chatapi";
import { CHAT_KEY } from "./lib/constants";

const items = [
  { prompt: "Button 1", spec: "Spec 1", response: "Response 1" },
  { prompt: "Button 2", spec: "Spec 2", response: "Response 2" },
  { prompt: "Button 3", spec: "Spec 3", response: "Response 3" },
  // Add more items as needed
];
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());


export default function Home() {
  const [chatId, setChatId] = useState<string>();
  const user = "guest";
  const [chat, setChat] = useState<ChatData>();
  const [text, setText] = useState<string>();

  const listRef = useRef(null);

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
  }, []);

  useEffect(() => {
    // @ts-ignore
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [chat?.messages, text]);

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
    <Container  maxWidth="lg">
      <Box  ref={listRef} className="p-5 h-[calc(100vh-225px)] overflow-y-auto" sx={{scrollbarWidth:"thin"}}>
        {!!chat &&
          chat.messages.map((i) => (
            <Bubble
              key={i.id}
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
            }).then((data) => {
              setChat(data);
              setText("");
            });
          }
        }}
      />
    </Container>
  );
}
