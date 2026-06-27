import { useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import type {
  IAula,
  IConfiguracaoOficina,
  IOficina,
  IOficinaTutor,
} from "../../../Oficinas/interface";
import type { ITema } from "../../../Temas/inteface";
import { TableContainer } from "./styles";

interface Props {
  oficina: Partial<IOficina> & {
    tema?: Partial<ITema>;
    aulas?: Partial<IAula>[];
    tutores?: Partial<IOficinaTutor>[];
    configuracoes?: Partial<IConfiguracaoOficina>[];
  };
}

const PromiseModal = ({
  isOpen,
  onResolve,
  oficina,
}: Props & InstanceProps<unknown>) => {
  const aulasOrdenadas = useMemo(() => {
    return [...(oficina.aulas || [])].sort(
      (a, b) => new Date(a.a_data!).getTime() - new Date(b.a_data!).getTime(),
    );
  }, [oficina.aulas]);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{oficina.tema?.t_nome || "Oficina"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row
          className="g-3"
          style={{ maxHeight: "600px", height: "100%", overflowY: "auto" }}
        >
          <Col md={12}>
            <Card>
              <Card.Header>Informações Gerais</Card.Header>

              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Tema:</strong> {oficina.tema?.t_nome}
                    </p>
                  </Col>

                  <Col md={6}>
                    <p>
                      <strong>Carga Horária:</strong> {oficina.of_carga_horaria}
                      h
                    </p>
                  </Col>

                  <Col md={6}>
                    <p>
                      <strong>Data Inicial:</strong>{" "}
                      {oficina.of_data_inicio
                        ? format(new Date(oficina.of_data_inicio), "dd/MM/yyyy")
                        : "-"}
                    </p>
                  </Col>

                  <Col md={6}>
                    <p>
                      <strong>Data Final:</strong>{" "}
                      {oficina.of_data_fim
                        ? format(new Date(oficina.of_data_fim), "dd/MM/yyyy")
                        : "-"}
                    </p>
                  </Col>

                  <Col md={12}>
                    <p>
                      <strong>Limite de Faltas:</strong>{" "}
                      {oficina.of_limite_faltas}
                    </p>
                  </Col>

                  <Col md={12}>
                    <p>
                      <strong>Descrição:</strong>
                    </p>

                    <p className="mb-0">
                      {oficina.of_descricao || "Nenhuma descrição informada."}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Dia e hora</Card.Header>

              <Card.Body>
                {!oficina.configuracoes?.length ? (
                  <span>Nenhuma definição de data e hora encontrada.</span>
                ) : (
                  oficina.configuracoes.map((config, index) => (
                    <div key={`config-${index}`} className="mb-3">
                      <p>
                        <strong>Dia:</strong> {config.co_dia_semana}
                      </p>

                      <p className="mb-0">
                        <strong>Horário:</strong> {config.co_horario_inicio}
                        {" - "}
                        {config.co_horario_fim}
                      </p>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="h-100">
              <Card.Header>Tutores</Card.Header>

              <Card.Body>
                {!oficina.tutores?.length ? (
                  <span>Nenhum tutor vinculado.</span>
                ) : (
                  <ListGroup>
                    {oficina.tutores.map((tutor, index) => (
                      <ListGroup.Item key={`tutor-${index}`}>
                        {tutor.usuario?.usu_nome || `Tutor ${tutor.usu_id}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={12}>
            <Card>
              <Card.Header>Resumo</Card.Header>

              <Card.Body>
                <Badge bg="primary">{oficina.aulas?.length || 0} aulas</Badge>

                <Badge bg="success" className="ms-2">
                  {oficina.of_carga_horaria}h
                </Badge>

                <Badge bg="warning" text="dark" className="ms-2">
                  {oficina.tutores?.length || 0} tutores
                </Badge>
              </Card.Body>
            </Card>
          </Col>

          <Col md={12}>
            <Card>
              <Card.Header>Cronograma das Aulas</Card.Header>

              <Card.Body className="p-0">
                {!aulasOrdenadas.length ? (
                  <div className="p-3">Nenhuma aula cadastrada.</div>
                ) : (
                  <TableContainer>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Título</th>
                          <th>Data</th>
                          <th>Horário</th>
                        </tr>
                      </thead>

                      <tbody>
                        {aulasOrdenadas.map((aula, index) => (
                          <tr key={aula.a_id}>
                            <td>{index + 1}</td>
                            <td>{aula.a_titulo}</td>
                            <td>
                              {format(new Date(aula.a_data!), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </td>
                            <td>
                              {aula.a_hora_inicio} - {aula.a_hora_fim}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableContainer>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalMaisInformacoes = create(PromiseModal);
