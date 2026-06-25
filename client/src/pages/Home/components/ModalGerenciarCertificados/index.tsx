import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type { IOficina } from "../../../Oficinas/interface";
import type { IUsuario } from "../../../Usuarios/interface";
import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import { ModalEditarFaltas } from "../ModalEditarFaltas";

interface IAlunoOficina extends IUsuario {
  aprovado: boolean;
  faltas: number;
  certificado_disponibilizado: boolean;
}

interface Props {
  oficina: Partial<IOficina>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  oficina,
}: Props & InstanceProps<unknown>) => {
  const [alunos, setAlunos] = useState<Partial<IAlunoOficina>[]>([]);
  const [filtroNome, setFiltroNome] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [disponibilizando, setDisponibilizando] = useState(false);

  const disponibilizaCertificadoPorAluno = async (
    usu_id: number,
  ) => {
    setDisponibilizando(true);

    try {
      await api.post(`/certificado/aluno/`, {
        of_id: oficina.of_id,
        usu_id,
      });

      await fetch();

      toast.success(
        "Certificado disponibilizado com sucesso.",
      );
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao disponibilizar o certificado.",
      );
    } finally {
      setDisponibilizando(false);
    }
  };

  const disponibilizaCertificadoDosAlunosAprovados =
    async () => {
      setDisponibilizando(true);

      try {
        await api.post(
          `/certificado/alunos-aprovados/`,
          {
            of_id: oficina.of_id,
          },
        );

        await fetch();

        toast.success(
          "Certificados disponibilizados para alunos aprovados com sucesso.",
        );
      } catch (error) {
        toast.error(
          "Ocorreu um erro ao disponibilizar os certificados.",
        );
      } finally {
        setDisponibilizando(false);
      }
    };

  const handleEditarFalta = async (usu_id: number) => {
    await ModalEditarFaltas({ usu_id, of_id: oficina.of_id || -1 });

    await fetch();
  };

  const fetch = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get<
        Partial<IAlunoOficina>[]
      >(`/matricula/alunos-oficina/${oficina.of_id}`);

      setAlunos(data);
    } catch (error) {
      toast.error(
        "Ocorreu um erro ao listar os alunos da oficina",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) =>
      aluno.usu_nome
        ?.toLowerCase()
        .includes(filtroNome.toLowerCase()),
    );
  }, [alunos, filtroNome]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal
      show={isOpen}
      onHide={() => onResolve()}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Gerenciamento de Certificados
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3">
          <Col md={12}>
            <Form.Control
              placeholder="Pesquisar aluno pelo nome..."
              value={filtroNome}
              onChange={(e) =>
                setFiltroNome(e.target.value)
              }
            />
          </Col>

          <Col md={12}>
            <Button
              className="w-100"
              variant="success"
              disabled={disponibilizando}
              onClick={
                disponibilizaCertificadoDosAlunosAprovados
              }
            >
              {disponibilizando ? (
                <Spinner
                  animation="border"
                  size="sm"
                />
              ) : (
                "Disponibilizar Certificados para Todos os Aprovados"
              )}
            </Button>
          </Col>

          <Col md={12}>
            {isLoading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" />
              </div>
            ) : !alunosFiltrados.length ? (
              <Alert variant="secondary">
                Nenhum aluno encontrado.
              </Alert>
            ) : (
              <div
                style={{
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                <ListGroup>
                  {alunosFiltrados.map((aluno) => (
                    <ListGroup.Item
                      key={aluno.usu_id}
                    >
                      <Card border="light">
                        <Card.Body>
                          <Row>
                            <Col md={12}>
                              <h5 className="mb-3">
                                {aluno.usu_nome}
                              </h5>
                            </Col>

                            <Col
                              md={12}
                              className="d-flex flex-wrap align-items-center gap-2"
                            >
                              <span>
                                <strong>
                                  Faltas:
                                </strong>{" "}
                                {aluno.faltas}
                              </span>

                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() =>
                                  handleEditarFalta(
                                    Number(
                                      aluno.usu_id,
                                    ),
                                  )
                                }
                              >
                                Editar Faltas
                              </Button>

                              <span>|</span>

                              <span>
                                <strong>
                                  Limite de faltas:
                                </strong>{" "}
                                {
                                  oficina.of_limite_faltas
                                }
                              </span>

                              <span>|</span>

                              <span>
                                <strong>
                                  Aprovado:
                                </strong>
                              </span>

                              <Badge
                                bg={
                                  aluno.aprovado
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {aluno.aprovado
                                  ? "Sim"
                                  : "Não"}
                              </Badge>

                              <span>|</span>

                              {aluno.certificado_disponibilizado ? (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled
                                >
                                  Certificado Disponibilizado
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="success"
                                  disabled={
                                    !aluno.aprovado ||
                                    disponibilizando
                                  }
                                  onClick={() =>
                                    disponibilizaCertificadoPorAluno(
                                      Number(
                                        aluno.usu_id,
                                      ),
                                    )
                                  }
                                >
                                  Disponibilizar
                                  Certificado
                                </Button>
                              )}
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onResolve()}
        >
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalGerenciarCertificados =
  create(PromiseModal);
