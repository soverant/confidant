"use client";
import {
  Box,
  FormControl,
  IconButton,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Container,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Bubble, BubbleProps } from "./ui/Bubble";
import { ChatInput } from "./ui/ChatInput";
import { useEffect, useRef, useState } from "react";
import { ChatData, Message, getChatData, sendMessage } from "./lib/chatapi";
import { PosetFrom } from "./ui/PosetFrom";
import {HorizontalScrollButtons} from "./ui/HorizontalScrollButtons";

const items = [
  { prompt: "Button 1", spec: "Spec 1", response: "Response 1" },
  { prompt: "Button 2", spec: "Spec 2", response: "Response 2" },
  { prompt: "Button 3", spec: "Spec 3", response: "Response 3" },
  // Add more items as needed
];
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CHAT_KEY = "chat";
export default function Home() {
  const [chatId, setChatId] = useState<string>();
  const user = "guest";
  const [chat, setChat] = useState<ChatData>();
  const [text, setText] = useState<string>();

  const listRef = useRef(null);

  // useEffect(() => {
  //   const _chatId = localStorage.getItem(CHAT_KEY);

  //   getChatData(
  //     _chatId
  //       ? `http://localhost:8000/chat/${_chatId}`
  //       : "http://localhost:8000/chat/create/0"
  //   ).then((data) => {
  //     setChat(data);
  //     setChatId(data.id);
  //     localStorage.setItem(CHAT_KEY, data.id);
  //   });
  // }, []);

  useEffect(() => {
    // @ts-ignore
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [chat?.messages]);

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
      <Container
        ref={listRef}
        sx={{ maxHeight: "79%" }}
        className="overflow-y-auto"
        maxWidth="lg"
      >
        <PosetFrom />
        <div>
          <h1>Horizontal Scroll Buttons</h1>
          <HorizontalScrollButtons items={items} />
        </div>
        {/* {!!chat &&
          chat.messages.map((i) => (
            <Bubble
              key={i.id}
              content={i.content}
              type={mapSenderType(i.sender_type)}
            ></Bubble>
          ))} */}
      </Container>
      <Container
        sx={{ maxWidth: "lg" }}
        maxWidth="lg"
        className="fixed bottom-0 left-0 right-0"
        disableGutters
      >
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
