import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { Client } from "@/app/lib/client";
import { useProjects } from "@/app/lib/hooks/poset";

interface ProjectFormProps {
  onSubmit?: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  const { onSubmit } = props;
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
  });
  const { mutate } = useProjects();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formValues);
    const project = await Client.createProjectApiStudioProjectsPost({
      requestBody: {
        title: formValues.title,
        description: formValues.description,
      },
    });
    mutate();
    onSubmit && onSubmit();
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
