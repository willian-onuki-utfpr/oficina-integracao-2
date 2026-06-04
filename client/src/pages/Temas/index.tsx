import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Spinner,
  Table,
} from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { ModalCadastrar } from "./components/ModalCadastrar";
import { useEffect, useMemo, useState } from "react";
import type { ITema } from "./inteface";
import { buscarTemas } from "./services/buscarTemas";
import { excluirTemas } from "./services/excluirTema";
import { ModalConfirmacao } from "../../components/ModalConfirmacao";

interface Props {}

export const Temas = ({}: Props) => {
  const [temas, setTemas] = useState<Partial<ITema>[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [filtros, setFiltros] = useState<Partial<ITema>>({
    t_nome: "",
  });

  const handleModalCriar = async () => {
    await ModalCadastrar();
    await fetch();
  };

  const handleModalEditar = async (tema: Partial<ITema>) => {
    await ModalCadastrar({
      tema,
    });
    await fetch();
  };

  const handleExcluir = async (t_id: number) => {
    const confirmacao = await ModalConfirmacao({
      variant: "danger",
      message: "Tem certeza que deseja excluir esse tema?"
    })

    if (!confirmacao) return;

    await excluirTemas(t_id);
    await fetch();
  };

  const valoresFiltrados = useMemo(() => {
    return (temas || []).filter((tema) => {
      const filtroNome =
        !filtros.t_nome ||
        tema.t_nome
          ?.toLowerCase()
          .includes(filtros.t_nome.toLowerCase());

      return filtroNome ;
    });
  }, [temas, filtros]);

  const renderizarLista = useMemo(() => {
    return valoresFiltrados.map((tema, index) => (
      <tr key={`linha-usuario-${tema.t_id}-${index}`}>
        <td>{tema.t_nome}</td>
        <td className="d-flex align-items-center justify-content-center gap-2">
          <Button size="sm" variant="primary">
            <FiEdit onClick={() => handleModalEditar(tema)} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleExcluir(tema.t_id)}
          >
            <FiTrash />
          </Button>
        </td>
      </tr>
    ));
  }, [valoresFiltrados]);

  const fetch = async () => {
    setIsLoading(true);
    const res = await buscarTemas();
    setTemas(res);
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container className="mt-4">
      <Col md="auto" className="w-100 d-flex gap-3 mb-3">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            placeholder="Filtrar por nome"
            value={filtros.t_nome ?? ""}
            onChange={(e) =>
              setFiltros((old) => ({
                ...old,
                t_nome: e.target.value,
              }))
            }
          />
        </Form.Group>
      </Col>
      <Col
        md="auto"
        className="w-100 d-flex align-items-center justify-content-start mb-3"
      >
        <Button variant="primary" onClick={handleModalCriar}>
          <FiPlus size={18} /> Adicionar
        </Button>
      </Col>

      {isLoading ? (
        <Col
          md="auto"
          className="w-100 h-100 flex-1 d-flex align-items-center justify-content-center"
        >
          <Spinner animation="border" />
        </Col>
      ) : !temas.length ? (
        <Alert variant="secondary">Nenhum tema cadastrado</Alert>
      ) : (
        <Card>
          <Card.Header>Lista de temas</Card.Header>
          <Card.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th />
                </tr>
              </thead>

              <tbody>{renderizarLista}</tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};
