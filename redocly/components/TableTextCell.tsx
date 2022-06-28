import React from "react";

import { Box } from "@mui/material";

export default function TableTextCell({ text }: { text: string }) {
  return (
    <Box sx={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }} title={text}>
      {text}
    </Box>
  );
}