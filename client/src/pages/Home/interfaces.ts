import type { IOficina } from "../Oficinas/interface";
import type { IMatricula } from "../OficinasCadastradas/interface";
import type { IUsuario } from "../Usuarios/interface";

export interface IOficinaRelatorio {
  of_id: number;
  of_descricao?: string;
  tema?: { t_nome: string };
  professor?: { usu_id: number; usu_nome: string };
  tutores?: { usu_id: number; of_id: number; usuario: { usu_id: number; usu_nome: string } }[];
  matriculas?: { m_id: number }[];
}

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