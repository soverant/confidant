import {
  Box,
  FormControl,
  IconButton,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Bubble } from "./ui/Bubble";
import { ChatInput } from "./ui/ChatInput";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 h-full">
      <Box className="flex-grow mt-2">
        <Bubble
          content="User Message ... Hello when a;ldfkj;lsadkfjas;df as;dflkj;sdlkf;lsdfjk as;dflkj;asldjkf;sldfk as;dflkjas;dflkj;sldkfj \n asd\n asdasd\n"
          type="sent"
        />
        <Bubble content="Bot Message Hello when" type="received" />
        <Bubble content="system Hello when" type="system" />
      </Box>

      <ChatInput />
    </main>
  );
}
