import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/lib/theme";
import { ReactNode } from "react";

export const metadata = {
  title: "Soverant POC",
  description: "landing page of soverant POC",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>
            <CssBaseline enableColorScheme />
            <main>{children}</main>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
