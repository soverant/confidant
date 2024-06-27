import { FC } from "react";
import {
  Box,
  FormControl,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Button,
  Container,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAlt from "@mui/icons-material/RestartAlt";
import { CHAT_KEY } from "../lib/constants";

interface ChatInputProps {
  actions?: any[];
  text?: string;
  onTextChange?: (text: string) => void;
  onSend: () => void;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
  const { actions, text, onTextChange, onSend } = props;
  return (
    <>
      <IconButton
        className="absolute bottom-0 left-0"
        aria-label="reset"
        onClick={() => {
          localStorage.removeItem(CHAT_KEY);
        }}
      >
        <RestartAlt></RestartAlt>
      </IconButton>
      <Box className="flex-1 flex flex-col justify-around ">
        {!!actions && actions.length > 0 && (
          <Box className="px-2 py-1 flex flex-col justify-center">
            <Button variant="contained" href="#contained-buttons">
              Actions
            </Button>
          </Box>
        )}
        <div className="p-2">
          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              multiline
              maxRows={10}
              minRows={3}
              id="outlined-send-message"
              value={text}
              onChange={(e) => {
                onTextChange && onTextChange(e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end" className="self-start pt-2">
                  <IconButton
                    aria-label="send"
                    onClick={() => {
                      onSend();
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </Box>
    </>
  );
};
