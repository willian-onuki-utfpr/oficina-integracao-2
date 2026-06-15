import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Usuarios } from "../pages/Usuarios";
import { Oficinas } from "../pages/Oficinas";

import { PrivateRoute } from "./PrivateRoute";
import { Login } from "../pages/Login";
import { Temas } from "../pages/Temas";
import { useAuth } from "../contexts/authContext";
import { ProtectRoute } from "./ProtectRoute";
import { OficinasCadastradas } from "../pages/OficinasCadastradas";

export function AppRoutes() {
  const { usuario } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          {usuario?.tipo === "aluno" ? (
            <Route path="/aluno/oficinas" element={<OficinasCadastradas />} />
          ) : (
            <>
              <Route
                path="/"
                element={
                  <ProtectRoute>
                    <Home />
                  </ProtectRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectRoute>
                    <Usuarios />
                  </ProtectRoute>
                }
              />

              <Route
                path="/oficinas"
                element={
                  <ProtectRoute>
                    <Oficinas />
                  </ProtectRoute>
                }
              />

              <Route
                path="/temas"
                element={
                  <ProtectRoute>
                    <Temas />
                  </ProtectRoute>
                }
              />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
