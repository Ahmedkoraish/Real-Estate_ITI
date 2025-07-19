import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ListingDetails from "./pages/ListDetails";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/ListDetails" element={<ListingDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Booking" element={<Booking />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
