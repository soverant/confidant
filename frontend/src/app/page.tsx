"use client";
import { Box, Button, Container, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Bubble, BubbleProps } from "./ui/Bubble";
import { ChatInput } from "./ui/ChatInput";
import { useEffect, useRef, useState } from "react";
import { ChatData, Message, getChatData, sendMessage } from "./lib/chatapi";
import { CHAT_KEY } from "./lib/constants";
import Header from "./ui/Header";

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
    <>
      <Header
        title="Soverant"
        right={() => (
          <Box>
            <Button variant="text">Skip</Button>
          </Box>
        )}
      ></Header>
      <Box
        sx={{ scrollbarWidth: "thin" }}
        className="h-[calc(100vh-225px)] overflow-y-auto"
      >
        <Container  ref={listRef} maxWidth="lg">
          {!!chat &&
            chat.messages.map((i) => (
              <Bubble
                key={i.id}
                content={i.content}
                type={mapSenderType(i.sender_type)}
              ></Bubble>
            ))}
        </Container>
      </Box>
      <Container maxWidth="lg">
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
    </>
  );
}
