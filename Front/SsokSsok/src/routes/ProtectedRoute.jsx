// routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/tokenUtils";
import useAuthStore from "../stores/authStore";

const ProtectedRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isValid = accessToken && !isTokenExpired(accessToken);

  return isValid ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
