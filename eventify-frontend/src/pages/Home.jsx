import React from "react";
import { Typography } from "@mui/material";
import EventList from "../components/EventList";

function Home() {
  return (
    <div>
      <Typography variant="h4">Hi there! Welcome to Eventify 👋</Typography>
      <EventList />
    </div>
  );
}

export default Home;
