import { FC } from "react";
import {
  Box,
  FormControl,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = (props) => {
  return (
    <Box className="p-2 flex flex-col justify-center">
      <Box className="p-10  flex flex-col justify-center">
        <Button variant="contained" href="#contained-buttons">
          Actions
        </Button>
      </Box>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInput
          multiline
          rows={2}
          id="outlined-send-message"
          endAdornment={
            <InputAdornment position="end" className="self-start pt-2">
              <IconButton
                aria-label="send"
                // edge="end"
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          //   label="Password"
        />
      </FormControl>
    </Box>
  );
};
