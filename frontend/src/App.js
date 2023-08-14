import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import TweetsReplies from "./Pages/TweetsReplies";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const user = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/tweet/:id" element={<TweetsReplies />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
