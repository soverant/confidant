import { Box, Typography, Avatar, Stack } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import clsx from "clsx";
import { useTheme } from '@mui/material/styles';
import { FC, useMemo } from "react";

export interface BubbleProps {
  content?: string;
  type: "sent" | "received" | "system";
  avatar?: typeof Avatar;
}

export const Bubble: FC<BubbleProps> = (props) => {
  const { content = "", type } = props;
  const backgroundColor = useMemo(()=>{
    switch(type){
      case "sent":
        return "primary.light"
      case "received":
        return "text.secondary"
      case "system":
        return "background.paper"
    }
  },[type])
  const renderAvatar = ()=>{
    if(type !== "system")
      return <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>
  }
  return (
    <Box
      className={clsx("flex mb-4", {
        "flex-row-reverse justify-start pl-6": type === "sent",
        "flex-row justify-start pr-6": type === "received",
        "flex-row justify-center": type === "system",
      })}
    >
      {/* <Stack direction={type === "received"?"row":"row-reverse"} spacing={2}> */}
        {/* {renderAvatar()} */}
        <Box
          className={clsx(
            "mt-10 rounded-md flex-wrap x-overflow-hidden",
            {
              "p-4": type === "sent" || type === "received",
              "p-2": type === "system",
            }
          )}
          sx={{bgcolor:backgroundColor}}
        >
          <Typography className="max-w-md text-wrap overflow-hidden">{content}</Typography>
        </Box>
      {/* </Stack> */}
    </Box>
  );
};
