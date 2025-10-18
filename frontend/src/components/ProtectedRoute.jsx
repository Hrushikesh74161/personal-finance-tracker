import { Navigate } from "react-router-dom";
import { pageRoutes } from "../constants/pageRoutes";

export default function ProtectedRoute({ children }) {
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  if (!loginInfo || !loginInfo.token) {
    return <Navigate to={pageRoutes.LOGIN_PAGE} />;
  }

  return children;
}