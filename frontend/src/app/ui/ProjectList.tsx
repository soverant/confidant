// components/ProjectList.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Project } from "@/app/lib/generated-client/types.gen";
import { Services } from "@/app/lib/client";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Services
      .readAllProjectsApiStudioProjectsGet()
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
    <Container>
      <Grid container spacing={2}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} style={{ padding: "16px" }}>
              <Typography variant="h6">{project.title}</Typography>
              <Typography variant="body2">{project.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectList;
