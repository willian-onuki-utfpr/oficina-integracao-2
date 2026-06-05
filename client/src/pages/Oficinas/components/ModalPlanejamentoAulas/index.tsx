import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type { IAula } from "../../interface";
import { buscarAulasOficina } from "../../services/aula/buscarAulasOficina";
import { format, parse } from "date-fns";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { ModalCadastrarAula } from "./components/ModalCadastrarAula";
import { ModalConfirmacao } from "../../../../components/ModalConfirmacao";
import { excluirAula } from "../../services/aula/exluirAula";
import { criarAula } from "../../services/aula/criarAula";
import { editarAula } from "../../services/aula/editarAula";

interface Props {
  of_id: number;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  of_id,
}: Props & InstanceProps<unknown>) => {
  const [aulas, setAulas] = useState<Partial<IAula>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filtros, setFiltros] = useState<Partial<IAula>>({
    a_titulo: "",
  });
  const handleNovaAula = async () => {
    const aula = await ModalCadastrarAula({
      of_id
    })
    if (!aula) return 

    await criarAula(aula)
    await fetch();
  };

  const handleEditarAula = async (aula: Partial<IAula>) => {
    const aulaEditada = await ModalCadastrarAula({
      aula,
      of_id
    })
    if (!aulaEditada) return 

    await editarAula(aulaEditada)
    await fetch();
  };

  const handleExcluirAula = async (aula: Partial<IAula>) => {
    const confirmacao = await ModalConfirmacao({
      variant: "danger",
      message: "Tem certeza que deseja excluir essa aula?"
    })

    if (!confirmacao) return;
     
    await excluirAula(aula.a_id)
    await fetch();
  };

  const aulasFiltradas = useMemo(() => {
    return aulas.filter((aula) => {
      const filtroTitulo =
        !filtros.a_titulo ||
        aula.a_titulo?.toLowerCase().includes(filtros.a_titulo.toLowerCase());

      const filtroData =
        !filtros.a_data ||
        format(new Date(aula.a_data!), "yyyy-MM-dd") ===
          format(new Date(filtros.a_data), "yyyy-MM-dd");

      return filtroTitulo && filtroData;
    });
  }, [aulas, filtros]);

  const renderizarAulas = useMemo(() => {
    return aulasFiltradas.map((aula) => (
      <tr key={aula.a_id}>
        <td>{aula.a_titulo}</td>

        <td>{format(parse(String(aula.a_data), "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}</td>

        <td>{aula.a_hora_inicio}</td>

        <td>{aula.a_hora_fim}</td>

        <td className="text-center">
          <Button
            size="sm"
            variant="primary"
            className="me-2"
            onClick={() => handleEditarAula(aula)}
          >
            <FiEdit />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => handleExcluirAula(aula)}
          >
            <FiTrash />
          </Button>
        </td>
      </tr>
    ));
  }, [aulasFiltradas, aulas]);

  const fetch = async () => {
    const resAulas = await buscarAulasOficina(of_id);

    setAulas(resAulas || []);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Planejamento das aulas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={5}>
            <Form.Group>
              <Form.Label>Título</Form.Label>

              <Form.Control
                placeholder="Pesquisar título"
                value={filtros.a_titulo || ""}
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    a_titulo: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Data</Form.Label>

              <Form.Control
                type="date"
                value={
                  filtros.a_data
                    ? format(new Date(filtros.a_data), "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) =>
                  setFiltros((prev) => ({
                    ...prev,
                    a_data: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  }))
                }
              />
            </Form.Group>
          </Col>

          <Col md={3} className="d-flex align-items-end">
            <Button
              variant="secondary"
              onClick={() =>
                setFiltros({
                  a_titulo: "",
                })
              }
            >
              Limpar
            </Button>
          </Col>
        </Row>

        <div className="d-flex justify-content-start mb-3">
          <Button variant="success" onClick={handleNovaAula}>
            <FiPlus /> Nova Aula
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center">
            <Spinner />
          </div>
        ) : !aulasFiltradas.length ? (
          <Alert variant="secondary">Nenhuma aula cadastrada.</Alert>
        ) : (
          <Card>
            <Card.Body
              style={{
                maxHeight: "350px",
                overflowY: "auto",
              }}
            >
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Data</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>{renderizarAulas}</tbody>
              </Table>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalPlanejamentoAulas = create(PromiseModal);
