// routes/PrivateLayout.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Header } from "../components/Header";

export const PrivateRoute = () => {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );

};