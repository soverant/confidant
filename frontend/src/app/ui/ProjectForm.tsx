// components/PosetFrom.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import {
  CreateProjectApiStudioProjectsPostData,
} from "@/app/lib/generated-client";
import { Services } from "@/app/lib/client";

export const ProjectForm: React.FC = () => {
  const [formValues, setFormValues] =
    useState({
      title: "asd",
      description: "asdf",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
    Services.createProjectApiStudioProjectsPost({ requestBody:{title:formValues.title, description:formValues.description} });
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Project From
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
};
