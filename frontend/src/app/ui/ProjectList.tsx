// components/ProjectList.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Divider,
  ListSubheader,
} from "@mui/material";
import Link from "next/link";
import { Project } from "@/app/lib/generated-client/types.gen";
import { Services } from "@/app/lib/client";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Services.readAllProjectsApiStudioProjectsGet()
      .then((value) => {
        setProjects(value);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setProjects([]);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (projects.length < 1) {
    return <Container>item not found</Container>;
  }

  return (
    <List>
      <ListSubheader component="div" id="nested-list-subheader">
        Project List
      </ListSubheader>
      {projects.map((project, index) => (
        <Link key={project.id} href={`/studio/poset/${project.id}`}>
          <ListItemText
            primary={project.title}
            secondary={project.description}
          ></ListItemText>
          {projects.length !== index + 1 && <Divider component="li" />}
        </Link>
      ))}
    </List>
  );
};

export default ProjectList;
