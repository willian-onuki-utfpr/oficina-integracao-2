import type { IOficina } from "../Oficinas/interface";
import type { IMatricula } from "../OficinasCadastradas/interface";
import type { IUsuario } from "../Usuarios/interface";

export interface IOficinaProfessor extends IOficina {
  matriculas?: Partial<
    IMatricula & {
      aluno: Partial<IUsuario>;
    }
  >[];
}