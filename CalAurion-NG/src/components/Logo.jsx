import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const Logo = () => {
  return (
    <Box>
      <Link to="/">
        <Box component="img" src="/static/orion_copie2.png" alt="logo" maxWidth="180px" />
      </Link>
    </Box>
  );
};

export default Logo;
