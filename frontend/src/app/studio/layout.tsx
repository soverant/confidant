import { Container, Toolbar } from "@mui/material";
import { ReactNode } from "react";

export default function studioLayout({ children }: { children: ReactNode }) {
  return <Container maxWidth="lg">{children}</Container>;
}
