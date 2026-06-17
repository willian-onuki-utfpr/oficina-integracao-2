import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Spinner, Table } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import { format } from "date-fns";

import type { IOficinaProfessor, IPresenca } from "../../interfaces";

import { api } from "../../../../services/api";
import { toast } from "react-toastify";
import { Content } from "./styles";

interface Props {
  oficina: Partial<IOficinaProfessor>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  oficina,
}: Props & InstanceProps<unknown>) => {
  const [aulaSelecionada, setAulaSelecionada] = useState<number>(0);

  const [presencas, setPresencas] = useState<Partial<IPresenca>[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [marcarTodos, setMarcarTodos] = useState({
    presente: false,
    ausente: false,
  });

  const fetchPresencas = async () => {
    if (!aulaSelecionada) {
      setPresencas([]);
      return;
    }

    setIsLoading(true);

    try {
      const { data: resPresencas } = await api.get<Partial<IPresenca>[]>(
        `/presenca/aula/${aulaSelecionada}`,
      );

      if (!!resPresencas.length) {
        const presencasComAluno = resPresencas.map((presenca) => {
          const matricula = oficina.matriculas?.find(
            (m) => m.aluno?.usu_id === presenca.usu_id,
          );

          return {
            ...presenca,
            aluno: matricula?.aluno,
          };
        });

        setPresencas(presencasComAluno);
        return;
      }

      const alunos = oficina.matriculas?.map((m) => m.aluno) ?? [];

      const novasPresencas: Partial<IPresenca>[] = alunos.map((aluno) => ({
        a_id: aulaSelecionada,
        usu_id: aluno?.usu_id,
        aluno,
        p_presenca: undefined,
        p_data_registro: new Date(),
      }));

      setPresencas(novasPresencas);
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar as presenças.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCriar = async () => {
    setRegistrando(true);

    try {
      const body = presencas.map((p) => ({
        a_id: p.a_id,
        usu_id: p.usu_id,
        p_presenca: p.p_presenca,
      }));

      await api.post("/presenca", {
        presencas: body,
      });

      await fetchPresencas();
      setMarcarTodos({
        presente: false,
        ausente: false,
      });

      toast.success("Presenças registradas com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao registrar as presenças.");
    } finally {
      setRegistrando(false);
    }
  };

  const handleEditar = async () => {
    setRegistrando(true);

    try {
      const body = presencas.map((p) => ({
        p_id: p.p_id,
        a_id: p.a_id,
        usu_id: p.usu_id,
        p_presenca: p.p_presenca,
        p_data_registro: p.p_data_registro,
      }));

      await api.put("/presenca", {
        presencas: body,
      });

      await fetchPresencas();

      toast.success("Presenças atualizadas com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar as presenças.");
    } finally {
      setRegistrando(false);
    }
  };

  const handleMarcarTodos = (tipo: "presente" | "ausente") => {
    const valor = tipo === "presente";

    setMarcarTodos({
      presente: tipo === "presente",
      ausente: tipo === "ausente",
    });

    setPresencas((prev) =>
      prev.map((presenca) => ({
        ...presenca,
        p_presenca: valor,
      })),
    );
  };

  const registrar = useMemo(() => presencas.every((p) => !p.p_id), [presencas]);

  const possuiCamposPendentes = useMemo(
    () => presencas.some((p) => p.p_presenca === undefined),
    [presencas],
  );

  const handleAlterarPresenca = (usu_id: number, valor: boolean) => {
    setPresencas((prev) =>
      prev.map((presenca) =>
        presenca.usu_id === usu_id
          ? {
              ...presenca,
              p_presenca: valor,
            }
          : presenca,
      ),
    );
  };

  useEffect(() => {
    fetchPresencas();
  }, [aulaSelecionada]);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar Presenças</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Aula</Form.Label>

          <Form.Select
            value={aulaSelecionada}
            onChange={(e) => setAulaSelecionada(Number(e.target.value))}
          >
            <option value={0}>Selecione uma aula</option>

            {oficina.aulas?.map((aula) => (
              <option key={aula.a_id} value={aula.a_id}>
                {aula.a_titulo}
                {" ("}
                {aula.a_data ? format(new Date(aula.a_data), "dd/MM/yyyy") : ""}
                {")"}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {!aulaSelecionada ? (
          <div className="text-center text-muted">Selecione uma aula.</div>
        ) : isLoading ? (
          <Col className="d-flex justify-content-center">
            <Spinner animation="border" />
          </Col>
        ) : (
          <>
            <Col md="auto" className="w-100 d-flex gap-3">
              <Form.Check
                id={`checkbox-marcar-todos-presente`}
                label="Marcar todos como presente"
                checked={!!marcarTodos.presente}
                onChange={() => handleMarcarTodos("presente")}
              />
              <Form.Check
                id={`checkbox-marcar-todos-ausente`}
                label="Marcar todos como ausente"
                checked={!!marcarTodos.ausente}
                onChange={() => handleMarcarTodos("ausente")}
              />
            </Col>
            <Content>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Presença</th>
                  </tr>
                </thead>

                <tbody>
                  {presencas.map((presenca) => (
                    <tr key={presenca.usu_id}>
                      <td>{presenca.aluno?.usu_nome}</td>

                      <td
                        style={{
                          width: 200,
                        }}
                      >
                        <Form.Select
                          value={
                            presenca.p_presenca === undefined
                              ? ""
                              : String(presenca.p_presenca)
                          }
                          onChange={(e) =>
                            handleAlterarPresenca(
                              Number(presenca.usu_id),
                              e.target.value === "true",
                            )
                          }
                        >
                          <option value="">Selecione...</option>

                          <option value="true">Presente</option>

                          <option value="false">Ausente</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Content>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Fechar
        </Button>

        {!!aulaSelecionada && (
          <Button
            disabled={registrando || possuiCamposPendentes}
            variant="success"
            onClick={registrar ? handleCriar : handleEditar}
          >
            {registrando ? (
              <Spinner animation="border" size="sm" className="mx-4" />
            ) : registrar ? (
              "Registrar Presenças"
            ) : (
              "Editar Presenças"
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export const ModalGerenciarPresencas = create(PromiseModal);
