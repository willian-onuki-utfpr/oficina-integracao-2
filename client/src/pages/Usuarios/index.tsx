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
import type { IUsuario } from "./interface";
import { useEffect, useMemo, useState } from "react";
import { buscarUsuarios } from "./services/buscarUsuarios";
import { excluirUsuario } from "./services/excluirUsuario";
import { ModalConfirmacao } from "../../components/ModalConfirmacao";
import { useAuth } from "../../contexts/authContext";

interface Props {}

export const Usuarios = ({}: Props) => {
  const {usuario: usuarioAtual} = useAuth()
  const [usuarios, setUsuarios] = useState<Partial<IUsuario>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtros, setFiltros] = useState<Partial<IUsuario>>({
    usu_nome: "",
    usu_email: "",
    usu_tipo: "",
  });

  const handleModalCriar = async () => {
    await ModalCadastrar();
    await fetch();
  };

  const handleModalEditar = async (usuario: Partial<IUsuario>) => {
    await ModalCadastrar({
      usuario,
    });
    await fetch();
  };

  const handleExcluir = async (usu_id: number) => {
    const confirmacao = await ModalConfirmacao({
      variant: "danger",
      message: "Tem certeza que deseja excluir esse usuário?",
    });

    if (!confirmacao) return;

    await excluirUsuario(usu_id);
    await fetch();
  };

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const valoresFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const filtroNome =
        !filtros.usu_nome ||
        usuario.usu_nome
          ?.toLowerCase()
          .includes(filtros.usu_nome.toLowerCase());

      const filtroEmail =
        !filtros.usu_email ||
        usuario.usu_email
          ?.toLowerCase()
          .includes(filtros.usu_email.toLowerCase());

      const filtroTipo =
        !filtros.usu_tipo || usuario.usu_tipo === filtros.usu_tipo;

      return filtroNome && filtroEmail && filtroTipo && usuarioAtual.id !== usuario.usu_id;
    });
  }, [usuarios, filtros]);

  const renderizarLista = useMemo(() => {
    return valoresFiltrados.map((usuario, index) => (
      <tr key={`linha-usuario-${usuario.usu_id}-${index}`}>
        <td>{usuario.usu_nome}</td>
        <td>{usuario.usu_email}</td>
        <td>{capitalizeFirstLetter(usuario.usu_tipo)}</td>
        <td className="d-flex align-items-center justify-content-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleModalEditar(usuario)}
          >
            <FiEdit />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleExcluir(usuario.usu_id)}
          >
            <FiTrash />
          </Button>
        </td>
      </tr>
    ));
  }, [valoresFiltrados]);

  const fetch = async () => {
    setIsLoading(true);
    const res = await buscarUsuarios();
    setUsuarios(res);
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
            value={filtros.usu_nome ?? ""}
            onChange={(e) =>
              setFiltros((old) => ({
                ...old,
                usu_nome: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Filtrar por e-mail"
            value={filtros.usu_email ?? ""}
            onChange={(e) =>
              setFiltros((old) => ({
                ...old,
                usu_email: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Tipo</Form.Label>
          <Form.Select
            value={filtros.usu_tipo ?? ""}
            onChange={(e) =>
              setFiltros((old) => ({
                ...old,
                usu_tipo: e.target.value,
              }))
            }
          >
            <option value="">Todos os tipos</option>

            <option value="aluno">Aluno</option>

            <option value="professor">Professor</option>
          </Form.Select>
        </Form.Group>
        {!!Object.values(filtros).some(
          (value) => !!(value as string).length,
        ) && (
          <Col md={2} className="d-flex align-items-end justify-content-start">
            <Button
              variant="outline-secondary"
              onClick={() =>
                setFiltros({
                  usu_nome: "",
                  usu_email: "",
                  usu_tipo: "",
                })
              }
            >
              Limpar filtros
            </Button>
          </Col>
        )}
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
      ) : !usuarios.length ? (
        <Alert variant="secondary">Nenhum usuário cadastrado</Alert>
      ) : (
        <Card>
          <Card.Header>Lista de Usuários</Card.Header>
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
                  <th>E-mail</th>
                  <th>Tipo</th>
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
