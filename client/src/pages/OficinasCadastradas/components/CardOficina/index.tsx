import { Button, Card, Col } from "react-bootstrap";
import { Container, WallPaper } from "./styles";
import { ImEnter } from "react-icons/im";
import { MdInfoOutline } from "react-icons/md";
import { ModalConfirmacao } from "../../../../components/ModalConfirmacao";
import { criarMatricula } from "../../services/matricula/criarMatricula";
import { useAuth } from "../../../../contexts/authContext";
import { cancelarMatricula } from "../../services/matricula/cancelarMatricula";
import { FiX } from "react-icons/fi";
import { ModalMaisInformacoes } from "../ModalMaisInformacoes";
import { BsCalendar2Week } from "react-icons/bs";
import { ModalFrequencia } from "../ModalFrequencia";
import type { IOficinaAluno } from "../..";
import { GrCertificate } from "react-icons/gr";
import { ModalCertificado } from "../ModalCertificado";
import { api } from "../../../../services/api";
import type { ICertificado } from "../../interface";
import type { IUsuario } from "../../../Usuarios/interface";

interface Props {
  oficina: Partial<IOficinaAluno>;
  status: string;
  refresh: () => Promise<void>;
}

export const CardOficina = ({ oficina, status, refresh }: Props) => {
  const { usuario } = useAuth();

  const handleCriarMatricula = async () => {
    const confirmacao = await ModalConfirmacao({
      message: "Você realmente deseja se inscrever nessa oficina?",
      variant: "success",
    });

    if (!confirmacao) return;

    await criarMatricula({
      of_id: oficina.of_id,
      usu_id: usuario!.id,
    });
    await refresh();
  };

  const handleCancelarMatricula = async () => {
    const confirmacao = await ModalConfirmacao({
      message: "Você realmente deseja cancelar a inscrição dessa oficina?",
      variant: "danger",
    });

    if (!confirmacao) return;

    await cancelarMatricula(usuario!.id, oficina.of_id!);
    await refresh();
  };


  const handleModalCertificado = async () => {
    const {data} = await api.get<{certificado: Partial<ICertificado>, aluno: Partial<IUsuario>}>(`/certificado/detalhes/${oficina.of_id}/${usuario!.id}`);

    await ModalCertificado({
      certificado: data.certificado,
      usuario: data.aluno,
      oficina,
    });
  }

  return (
    <Container>
      <WallPaper id={oficina.of_id ?? 0} />
      <Card.Body>
        <Card.Title>{oficina.tema?.t_nome}</Card.Title>
        <Card.Text>{oficina.of_descricao || "Sem descrição"}</Card.Text>
      </Card.Body>
      <Col
        md="auto"
        className="d-flex align-items-center justify-content-start gap-2 p-2"
      >
        {status === "matriculado" ? (
          !!oficina.certificado_disponibilizado ? (
            <Button variant="success" onClick={handleModalCertificado}>
              <GrCertificate className="mb-1 me-1" />
              Certificado
            </Button>
          ) : (
            <>
              <Button variant="danger" onClick={handleCancelarMatricula}>
                <FiX className="mb-1 me-1" />
                Cancelar inscrição
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  ModalFrequencia({
                    oficina,
                    usu_id: usuario!.id,
                  })
                }
              >
                <BsCalendar2Week className="mb-1 me-1" />
                Frequência
              </Button>
            </>
          )
        ) : (
          <>
            <Button variant="primary" onClick={handleCriarMatricula}>
              <ImEnter className="mb-1 me-1" />
              Inscrever-se
            </Button>
            <Button
              variant="secondary"
              onClick={() => ModalMaisInformacoes({ oficina })}
            >
              <MdInfoOutline size={18} className="mb-1 me-1" />
              Mais informações
            </Button>
          </>
        )}
      </Col>
    </Container>
  );
};
