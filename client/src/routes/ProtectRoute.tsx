import { useAuth } from "../contexts/authContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ProtectRoute = ({ children }: Props) => {
  const { usuario } = useAuth();

  if (usuario?.tipo === "aluno") {
    return null;
  }

  return <>{children}</>;
};
