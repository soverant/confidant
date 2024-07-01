import { FC } from "react";
import {
  Container,
  List,
  ListItemText,
  Divider,
  ListSubheader,
} from "@mui/material";
import Link from "next/link";
import { useProjects } from "@/app/lib/hooks/poset";


const ProjectList: FC = () => {
  const {projects,isLoading} = useProjects()

  if (!projects && isLoading){
    return <>loading</>
  }

  if (!projects){
    return <Container>No Item</Container>
  }

  return (
    <List>
      <ListSubheader component="div" id="nested-list-subheader">
        Project List
      </ListSubheader>
      {projects.map((project, index) => (
        <Link key={project.id} href={`/studio/poset/${project.root_node_id}`}>
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
