import { FC, ReactNode } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";

interface HeaderProps {
  right?: () => ReactNode;
  left?: () => ReactNode;
  title?: string;
}

const Header: FC<HeaderProps> = (props) => {
  const { right, left, title } = props;
  return (
    <AppBar position="sticky">
      <Toolbar>
        {left && left()}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "block", sm: "block" } }}
        >
          Soverant
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {right && right()}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
