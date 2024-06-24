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

interface ChatInputProps {
  actions?: any[];
  text?: string;
  onTextChange?: (text: string) => void;
  onSend: () => void;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
  const { actions, text, onTextChange, onSend } = props;
  return (
    <Box className="flex-1 flex flex-col justify-around ">
      {/* {!!actions && actions.length > 0 && ( */}
      <Box className=" px-2 py-1  flex flex-col justify-center">
        <Button variant="contained" href="#contained-buttons">
          Actions
        </Button>
      </Box>
      {/* )} */}
      <div className="p-2">
        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            multiline
            rows={2}
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
  );
};
