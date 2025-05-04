import { useEffect, useState } from "react";
import axios from "axios";

const EventList = () => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/attendees")
      .then((response) => {
        setAttendees(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch attendees");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Attendees</h2>
      <ul>
        {attendees.map((att) => (
          <li key={att.id}>{att.firstname}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
