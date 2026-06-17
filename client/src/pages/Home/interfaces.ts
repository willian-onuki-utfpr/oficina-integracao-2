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

export interface IPresenca {
  p_id: number;
  a_id: number;
  usu_id: number;
  p_presenca: boolean;
  p_data_registro: Date;
  aluno?: Partial<IUsuario>;
}