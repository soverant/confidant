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

interface ChatInputProps {
  actions?: any[];
  text?: string;
  onTextChange?: (text: string) => void;
  onSend: () => void;
}

export const ChatInput: FC<ChatInputProps> = (props) => {
  const { actions, text, onTextChange, onSend } = props;
  return (
    <Box className="p-2 flex flex-col justify-center">
      {!!actions && actions.length > 0 && (
        <Box className="p-10  flex flex-col justify-center">
          <Button variant="contained" href="#contained-buttons">
            Actions
          </Button>
        </Box>
      )}
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
    </Box>
  );
};
