import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import {
  ReadNodeChildrenApiStudioPosetNodesNodeIdChildrenGetResponse,
  ReadNodeParentsApiStudioPosetNodesNodeIdParentsGetResponse,
} from "../lib/generated-client";
import Link from "next/link";

type Items =
  | ReadNodeChildrenApiStudioPosetNodesNodeIdChildrenGetResponse
  | ReadNodeParentsApiStudioPosetNodesNodeIdParentsGetResponse;

interface PosetHorizontalListProps {
  items?: Items;
}

const ScrollContainer = styled(Box)({
  display: "flex",
  overflowX: "auto",
  whiteSpace: "nowrap",
  padding: "16px",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
});

export const PosetHorizontalList: React.FC<PosetHorizontalListProps> = ({
  items,
}) => {
  if (!items) {
    return <>root or leaf</>;
  }
  return (
    <ScrollContainer>
      {items.map((item, index) => (
        <Link key={index} href={`/studio/poset/${item.id}`}>
          <Button
            variant="contained"
            style={{ marginRight: "8px" }}
            // onClick={() => alert(item.response)}
          >
            {item.title}
          </Button>
        </Link>
      ))}
    </ScrollContainer>
  );
};
