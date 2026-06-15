export type StatusMatricula =
  | "matriculado"
  | "aprovado"
  | "reprovado"
  | "cancelado";

export interface IMatricula {
  m_id: number;
  usu_id: number;
  of_id: number;
  m_status: string; // matriculado, aprovado, reprovado, cancelado
}
