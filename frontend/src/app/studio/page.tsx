"use client";
import { Button, Toolbar } from "@mui/material";
import { PosetFrom } from "@/app/ui/PosetFrom";
import { HorizontalScrollButtons } from "@/app/ui/HorizontalScrollButtons";
import ProjectList from "@/app/ui/ProjectList";
import {ProjectForm} from "@/app/ui/ProjectForm";

const items = [
  { prompt: "Button 1", spec: "Spec 1", response: "Response 1" },
  { prompt: "Button 2", spec: "Spec 2", response: "Response 2" },
  { prompt: "Button 3", spec: "Spec 3", response: "Response 3" },
  // Add more items as needed
];

export default function StudioHome() {

  return (
    <>
       
      <ProjectList />
      <ProjectForm />
    </>
  );
}
