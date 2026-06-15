import type { ITema } from "../Temas/inteface";
import type { IUsuario } from "../Usuarios/interface";

export interface IOficina {
  of_id: number;
  t_id: number;
  of_descricao: string;
  of_data_inicio: string;
  of_data_fim: string;
  of_carga_horaria: number;
  of_limite_faltas: number;
  of_professor_responsavel: number;
  tema?: Partial<ITema>;
  tutores?: Partial<IOficinaTutor>[];
  configuracoes?: Partial<IConfiguracaoOficina>[];
}

export interface IOficinaTutor {
  of_id: number;
  usu_id: number;
  usuario: Partial<IUsuario>;
}

export interface IConfiguracaoOficina {
  co_id: number;
  of_id: number;
  co_dia_semana: string;
  co_horario_inicio: string;
  co_horario_fim: string;
}

export interface IAula {
  a_id: number;
  of_id: number;
  a_titulo: string;
  a_conteudo: string;
  a_data: Date;
  a_hora_inicio: string;
  a_hora_fim: string;
}