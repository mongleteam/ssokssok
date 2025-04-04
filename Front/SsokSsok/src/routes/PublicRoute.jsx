// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { isTokenExpired } from "../utils/tokenUtils";

const PublicRoute = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isValid = accessToken && !isTokenExpired(accessToken);

  return isValid ? <Navigate to="/main" replace /> : children;
};

export default PublicRoute;
