import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { GenericPage } from "../components/GenericPage";

export const PrivateRoute = () => {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <GenericPage>
      <Outlet />
    </GenericPage>
  );
};
