import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoAccounts from "./pages/DemoAccounts";

import DashboardRoutes from "./routes/DashboardRoutes";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Demo credentials page */}
        <Route path="/demo" element={<DemoAccounts />} />

        {DashboardRoutes()}

      </Routes>
    </Router>
  );
}

export default App;