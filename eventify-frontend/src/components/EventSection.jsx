import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from "@mui/material";

function EventSection({ title, events }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {event.date} | {event.location}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2">{event.summary}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  component={RouterLink}
                  to={`/events/${event.id}`}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EventSection;
