import { Box, Grid2 as Grid } from "@mui/material";
// import useGetChatsQuery from "../api/getChatsQuery";

export default function Page({ children, sx }) {

  return (
    <Grid
      container
      sx={{
        backgroundColor: "#fff",
        padding: "0 0 0 0",
      }}
    >
      <Box
        sx={[
          {
            overflowY: "auto",
            ...sx,
          },
        ]}
      >
        {children}
      </Box>
    </Grid>
  );
}