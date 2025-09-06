import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/auth/AdminLogin.jsx";
import DealerLogin from "./pages/auth/DealerLogin";
import BeneficiaryLogin from "./pages/auth/BeneficiaryLogin";
import Signup from "./pages/auth/Signup";
import DealerStock from "./pages/dealer/DealerStock";
import DealerDistribution from "./pages/dealer/DealerDistribution";
import BeneficiaryHome from "./pages/beneficiary/BeneficiaryHome";
import MyQuota from "./pages/beneficiary/MyQuota";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/dealer/login" element={<DealerLogin />} />
      <Route path="/beneficiary/login" element={<BeneficiaryLogin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dealer Dashboard */}
      <Route path="/dealer/stock" element={<DealerStock />} />
      <Route path="/dealer/distribution" element={<DealerDistribution />} />

      {/* Beneficiary Dashboard */}
      <Route path="/beneficiary/home" element={<BeneficiaryHome />} />
      <Route path="/beneficiary/quota" element={<MyQuota />} />

      {/* Admin Dashboard */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;