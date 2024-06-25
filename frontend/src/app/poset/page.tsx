"use client";
import { Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ChatData, Message, sendMessage } from "@/app/lib/chatapi";
import { PosetFrom } from "@/app/ui/PosetFrom";
import { HorizontalScrollButtons } from "@/app/ui/HorizontalScrollButtons";

const items = [
  { prompt: "Button 1", spec: "Spec 1", response: "Response 1" },
  { prompt: "Button 2", spec: "Spec 2", response: "Response 2" },
  { prompt: "Button 3", spec: "Spec 3", response: "Response 3" },
  // Add more items as needed
];

export default function PosetHome() {

  return (
    <Container maxWidth="lg">
      <PosetFrom />
      <div>
        <h1>Horizontal Scroll Buttons</h1>
        <HorizontalScrollButtons items={items} />
      </div>
    </Container>
  );
}
