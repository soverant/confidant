"use client";
import { Services } from "@/app/lib/client";
import { usePosetChildrens, usePosetParents } from "@/app/lib/hooks/poset";
import { PosetFrom } from "@/app/ui/PosetFrom";
import { PosetHorizontalList } from "@/app/ui/PosetHorizontalList";
import { ProjectForm } from "@/app/ui/ProjectForm";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Suspense, useState } from "react";

export default function Poset({ params }: { params: { id: string } }) {
  const childrens = usePosetChildrens(Number(params.id));
  const parents = usePosetParents(Number(params.id));
  const [openForm, setOpenForm] = useState(false);
  const [newPosetTitle, setNewPosetTitle] = useState("");
  const handleCloseFrom = () => {
    setOpenForm(false);
  };

  const handleOpenFrom = (_e: any) => {
    setOpenForm(true);
  };

  const newChild = async () => {
    const newNode = await Services.createNodeApiStudioPosetNodesPost({
      requestBody: { title: newPosetTitle },
    });
    await Services.createEdgeApiStudioPosetEdgesPost({
      requestBody: { from_node: Number(params.id), to_node: newNode.id },
    });
    childrens.mutate();
  };

  const handleNewPosetTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setNewPosetTitle(value);
  };

  const renderNewChildModalForm = () => {
    return (
      <Dialog open={openForm} onClose={handleCloseFrom}>
        <DialogTitle>New Child</DialogTitle>
        <DialogContent>
          <TextField
            label="Problem Spec"
            name="spec"
            value={newPosetTitle}
            onChange={handleNewPosetTitleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFrom}>Cancel</Button>
          <Button onClick={newChild}>Create</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container>
      <Suspense>
        <PosetHorizontalList items={parents.parents} />
      </Suspense>
      <PosetFrom id={Number(params.id)} />
      <div>
        <Button onClick={handleOpenFrom}>Add child</Button>
      </div>
      <Suspense>
        <PosetHorizontalList items={childrens.childrens} />
      </Suspense>
      {renderNewChildModalForm()}
    </Container>
  );
}
