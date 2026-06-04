import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { authStorage } from "../auth/storage";

export interface IUsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface ILoginResponse {
  usuario: IUsuarioLogado;
  token: string;
}

interface AuthContextData {
  usuario: IUsuarioLogado | null;
  token: string | null;
  autenticado: boolean;
  loading: boolean;

  login(data: ILoginResponse): void;
  logout(): void;

  setUsuario(
    usuario: IUsuarioLogado | null
  ): void;

  setLoading(
    loading: boolean
  ): void;
}

const AuthContext = createContext(
  {} as AuthContextData
);

export const AuthProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [usuario, setUsuario] =
    useState<IUsuarioLogado | null>(
      authStorage.getUser()
    );

  const [token, setToken] =
    useState<string | null>(
      authStorage.getToken()
    );

  const [loading, setLoading] =
    useState(true);

  const login = (data: ILoginResponse) => {
    authStorage.setToken(data.token);
    authStorage.setUser(data.usuario);

    setUsuario(data.usuario);
    setToken(data.token);
  };

  const logout = () => {
    authStorage.clear();

    setUsuario(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      usuario,
      token,
      loading,

      autenticado: !!token,

      login,
      logout,

      setUsuario,
      setLoading,
    }),
    [usuario, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);