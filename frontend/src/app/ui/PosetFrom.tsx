// components/PosetFrom.tsx
"use client";
import { FC, useState, ForwardedRef } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";

export interface PosetFromProps {
  onSubmit?: () => void;
  id: number;
}

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ForwardRefEditor } from "./MDXEditor/ForwardRefEditor";
import "@mdxeditor/editor/style.css";
import { usePoset } from "../lib/hooks/poset";
import { Client } from "../lib/client";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `editor-tab-${index}`,
    "aria-controls": `editor-tabpanel-${index}`,
  };
}

type Field = "spec" | "prompt" | "response";

export const PosetFrom: FC<PosetFromProps> = (props) => {
  const { id, onSubmit = () => {} } = props;
  const { poset, isError, isLoading } = usePoset(id);

  const [spec, setSpec] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const [selectedTab, setSelectedTab] = useState<Field>("spec");
  const handleTabChange = (event: React.SyntheticEvent, newValue: Field) => {
    console.log(newValue);
    setSelectedTab(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Client.updateNodeApiStudioPosetNodesNodeIdPut({
      nodeId: id,
      requestBody: { spec, prompt, response },
    });
  };

  React.useEffect(() => {
    if (poset) {
      setSpec(poset?.spec || "");
      setPrompt(poset?.prompt || "");
      setResponse(poset?.response || "");
    }
  }, [poset]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="poset editor"
        >
          <Tab value="spec" label="Problem Spec" {...a11yProps(0)} />
          <Tab value="prompt" label="Prompt" {...a11yProps(1)} />
          <Tab value="response" label="Response" {...a11yProps(2)} />
          <Box className="flex-grow" />
          <Button onClick={handleSubmit}>Save</Button>
        </Tabs>
      </Box>
      <Box>
        {selectedTab === "spec" && (
          <ForwardRefEditor
            className="mdx dark-theme"
            contentEditableClassName="prose"
            markdown={spec}
            onChange={(value) => setSpec(value)}
          />
        )}
        {selectedTab === "prompt" && (
          <ForwardRefEditor
            className="mdx dark-theme"
            contentEditableClassName="prose"
            markdown={prompt}
            onChange={(value) => setPrompt(value)}
          />
        )}
        {selectedTab === "response" && (
          <ForwardRefEditor
            className="mdx dark-theme"
            contentEditableClassName="prose"
            markdown={response}
            onChange={(value) => setResponse(value)}
          />
        )}
      </Box>
    </>
  );
};
