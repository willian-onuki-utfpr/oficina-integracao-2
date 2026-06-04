import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { Usuarios } from "../pages/Usuarios";
import { Oficinas } from "../pages/Oficinas";

import { PrivateRoute } from "./PrivateRoute";
import { Login } from "../pages/Login";
import { Temas } from "../pages/Temas";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <Login />
          } />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />

          <Route path="/usuarios" element={<Usuarios />} />

          <Route path="/oficinas" element={<Oficinas />} />

          <Route path="/temas" element={<Temas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
