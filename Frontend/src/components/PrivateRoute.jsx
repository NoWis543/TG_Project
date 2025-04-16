import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAuth } = useSelector((state) => state.auth);
  const location = useLocation();

  return isAuth ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}

export default PrivateRoute;
