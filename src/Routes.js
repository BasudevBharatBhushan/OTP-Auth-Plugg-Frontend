import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registered from "./pages/Registered";
import ErrorOtp from "./pages/ErrorOtp";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:mobileNumber" element={<Home />} />
        <Route path="/registered" element={<Registered />} />
        <Route path="/error-otp" element={<ErrorOtp />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
