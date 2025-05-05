import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Event from "./pages/Event";
import EventRegistration from "./pages/EventRegistration";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId" element={<Event />} />
          <Route
            path="/events/:eventId/register"
            element={<EventRegistration />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
