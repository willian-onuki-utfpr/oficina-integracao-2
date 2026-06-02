import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Usuarios } from '../pages/Usuarios';
import { Oficinas } from '../pages/Oficinas';
import { Header } from '../components/Header';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/usuarios"
          element={<Usuarios />}
        />

        <Route
          path="/oficinas"
          element={<Oficinas />}
        />
      </Routes>
    </BrowserRouter>
  );
}