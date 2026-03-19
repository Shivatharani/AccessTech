import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (token && token !== "null" && token !== "undefined") {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default PublicRoute;
