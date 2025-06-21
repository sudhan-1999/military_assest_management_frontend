import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard.jsx";
import Purchase from "./Purchase.jsx";
import Transfer from "./Transfer.jsx";
import Assign from "./Assign.jsx";
import Expenditure from "./Expenditure.jsx";
import Registeruser from "./Registeruser.jsx";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/assign" element={<Assign />} />
        <Route path="/expend" element={<Expenditure />} />
        <Route path="/regiteruser" element={<Registeruser />} />
      </Route>
    </Routes>
  );
}

export default App;
