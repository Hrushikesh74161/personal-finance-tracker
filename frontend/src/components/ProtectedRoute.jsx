import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  if (!loginInfo) {
    return <Navigate to="/login" />;
  }

  return children;
}