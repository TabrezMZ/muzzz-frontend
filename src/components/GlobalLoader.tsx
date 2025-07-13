import { CircularProgress, Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

const GlobalLoader = () => {
  const theme = useTheme();  
  const authQueries = useSelector((state: RootState) => state.authApi.queries);
  const playlistQueries = useSelector((state: RootState) => state.playlistApi.queries);

  const isLoading =
    Object.values(authQueries).some((q: any) => q?.status === "pending") ||
    Object.values(playlistQueries).some((q: any) => q?.status === "pending");

  if (!isLoading) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)'}
      zIndex={9999}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default GlobalLoader;
