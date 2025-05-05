import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ py: 3, mt: "auto", backgroundColor: "#f5f5f5" }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Eventify developed by Ravindu Ratnayake.
          [All rights reserved.]
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
