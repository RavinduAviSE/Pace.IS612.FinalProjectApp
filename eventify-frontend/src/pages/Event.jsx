import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  Button,
  Avatar,
  Chip,
  Badge,
} from "@mui/material";

const Event = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event details:", err);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  if (!event) {
    return <Typography sx={{ mt: 4 }}>Event not found.</Typography>;
  }

  return (
    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item size={8}>
        <Chip label={event.organizor} />
        <Typography variant="h1" gutterBottom>
          {event.title}
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            📅{event.date} , {event.time}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            📍{event.location}
          </Typography>
          <Badge badgeContent={event.booked_seats} color="secondary">
            <Typography gutterBottom>🙋‍♀️🙋‍♂️</Typography>
          </Badge>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Total Attendies so far
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">{event.description}</Typography>
        </Box>
      </Grid>

      <Grid item size={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Register
          </Button>

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Have a question?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Ask questions you have about this event.
          </Typography>

          <Box mt={2}>
            <Avatar>📧</Avatar>
            <Typography fontWeight="bold">
              {event.organizor_contact_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <a href="">{event.organizor_contact_email}</a>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Event;
