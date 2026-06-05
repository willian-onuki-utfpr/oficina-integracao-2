import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Spinner,
  Table,
} from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash } from "react-icons/fi";
import { ModalCadastrar } from "./components/ModalCadastrar";
import { useEffect, useMemo, useState } from "react";
import type { IOficina } from "./interface";
import { buscarOficinas } from "./services/oficina/buscarOficinas";
import type { IUsuario } from "../Usuarios/interface";
import { buscarProfessores } from "./services/usuarios/buscarProfessores";
import { ModalConfirmacao } from "../../components/ModalConfirmacao";
import { TooltipButton } from "../../components/TooltipButton";
import { ModalEditar } from "./components/ModalEditar";
import { LuFileText } from "react-icons/lu";
import { ModalPlanejamentoAulas } from "./components/ModalPlanejamentoAulas";
import { excluirOficina } from "./services/oficina/excluirOficina";

interface Props {}

export const Oficinas = ({}: Props) => {
  const [oficinas, setOficinas] = useState<Partial<IOficina>[]>([]);
  const [filtros, setFiltros] = useState({
    t_nome: "",
  });
  const [professores, setProfessores] = useState<Partial<IUsuario>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalCriar = async () => {
    await ModalCadastrar();
    await fetch()
  };

  const handleModalEditar = async (oficina: Partial<IOficina>) => {
    await ModalEditar({
      oficinaCriada: oficina,
    });
    await fetch()
  };

  const handleExcluir = async (of_id: number) => {
    const confirmacao = await ModalConfirmacao({
      variant: "danger",
      message: "Tem certeza que deseja excluir essa oficina?",
    });

    if (!confirmacao) return;

    await excluirOficina(of_id);
    await fetch()
  };

  const valoresFiltrados = useMemo(() => {
    return oficinas.filter((of) => {
      const filtroNome =
        !filtros.t_nome ||
        of.tema?.t_nome?.toLowerCase().includes(filtros.t_nome.toLowerCase());

      // const filtroEmail =
      //   !filtros.usu_email ||
      //   usuario.usu_email
      //     ?.toLowerCase()
      //     .includes(filtros.usu_email.toLowerCase());

      // const filtroTipo =
      //   !filtros.usu_tipo || usuario.usu_tipo === filtros.usu_tipo;

      // return filtroNome e& filtroEmail && filtroTipo;
      return filtroNome;
    });
  }, [oficinas, filtros]);

  const renderizarLista = useMemo(() => {
    return valoresFiltrados.map((of, index) => (
      <tr key={`linha-oficina-${of.of_id}-${index}`}>
        <td>{of.tema?.t_nome}</td>
        <td>
          {
            professores.find((p) => p.usu_id === of.of_professor_responsavel)
              ?.usu_nome
          }
        </td>
        <td className="d-flex align-items-center justify-content-center gap-2">
          <TooltipButton
            legend="Planejamento das aulas"
            variant="primary"
            onClick={() => ModalPlanejamentoAulas({
              of_id: of.of_id
            })}
          >
            <LuFileText />
          </TooltipButton>
          <TooltipButton
            legend="Editar"
            variant="primary"
            onClick={() => handleModalEditar(of)}
          >
            <FiEdit />
          </TooltipButton>
          <TooltipButton
            legend="Excluir"
            variant="danger"
            onClick={() => handleExcluir(of.of_id)}
          >
            <FiTrash />
          </TooltipButton>
        </td>
      </tr>
    ));
  }, [valoresFiltrados]);

  const fetch = async () => {
    setIsLoading(true);
    const resOficinas = await buscarOficinas();
    const resProfessores = await buscarProfessores();

    setOficinas(resOficinas);
    setProfessores(resProfessores);
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Container className="mt-4">
      {/* <Col md="auto" className="w-100 d-flex gap-3 mb-3">
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
      </Col> */}
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
      ) : !oficinas.length ? (
        <Alert variant="secondary">Nenhuma oficina cadastrada.</Alert>
      ) : (
        <Card>
          <Card.Header>Lista de oficinas</Card.Header>
          <Card.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Tema</th>
                  <th>Professor responsável</th>
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
