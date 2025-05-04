import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import EventSection from "../components/EventSection";

function Home() {
  const [eventData, setEventData] = useState({
    this_week: [],
    trending: [],
    other: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/categorized-events")
      .then((res) => {
        setEventData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading events...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <EventSection title="This Week" events={eventData.this_week} />
      <EventSection title="Trending" events={eventData.trending} />
      <EventSection title="Other Events" events={eventData.other} />
    </Box>
  );
}

export default Home;
