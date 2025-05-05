import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import FileDownload from "js-file-download";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useState } from "react";

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      age: "",
      gender: "",
      state: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      age: Yup.number().required("Age is required").min(1),
      gender: Yup.string().required("Gender is required"),
      state: Yup.string().required("State is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      axios
        .post("http://127.0.0.1:5000/api/register", {
          ...values,
          event_id: eventId,
        })
        .then((res) => {
          const bookingId = res.data.booking_id;
          axios
            .get(`http://127.0.0.1:5000/api/ticket/${bookingId}`, {
              responseType: "blob",
            })
            .then((pdfRes) => {
              FileDownload(pdfRes.data, "ticket.pdf");
              setSnackbar({
                open: true,
                message: "Ticket downloaded!",
                severity: "success",
              });
            });
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
          resetForm();
          setTimeout(() => navigate(`/events/${eventId}`), 2000);
        })
        .catch((err) => {
          const msg = err.response?.data?.message || "Booking failed.";
          setSnackbar({
            open: true,
            message: msg,
            severity: "error",
          });
        });
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Register for Event
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="First Name"
          name="firstname"
          color="secondary"
          margin="normal"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          error={formik.touched.firstname && Boolean(formik.errors.firstname)}
          helperText={formik.touched.firstname && formik.errors.firstname}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastname"
          color="secondary"
          margin="normal"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          error={formik.touched.lastname && Boolean(formik.errors.lastname)}
          helperText={formik.touched.lastname && formik.errors.lastname}
        />
        <TextField
          fullWidth
          label="Age"
          name="age"
          color="secondary"
          type="number"
          margin="normal"
          value={formik.values.age}
          onChange={formik.handleChange}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
        />
        <TextField
          fullWidth
          label="Gender"
          name="gender"
          color="secondary"
          margin="normal"
          value={formik.values.gender}
          onChange={formik.handleChange}
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          helperText={formik.touched.gender && formik.errors.gender}
        />
        <TextField
          fullWidth
          label="State"
          name="state"
          color="secondary"
          margin="normal"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Submit Registration
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default EventRegistration;
