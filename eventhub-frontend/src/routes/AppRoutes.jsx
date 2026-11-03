import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import CreateEvent from "../pages/CreateEvent";
import EventMembers from "../components/EventMembers";
import EditEvent from "../pages/EditEvent";
import ProtectedRoute from "../components/ProtectedRoute";
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protect routes for the sequrity purpose */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />;
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/:id/members" element={<EventMembers />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
