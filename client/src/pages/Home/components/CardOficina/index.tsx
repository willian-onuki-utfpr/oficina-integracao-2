import { Container, WallPaper } from "./styles";
import { Button, Card, Col } from "react-bootstrap";
import type { IOficinaProfessor } from "../../interfaces";
import { IoMdCheckboxOutline } from "react-icons/io";
import { ModalGerenciarPresencas } from "../ModalGerenciarPresencas";
import { ModalGerenciarCertificados } from "../ModalGerenciarCertificados";

interface Props {
  oficina: Partial<IOficinaProfessor>;
  refresh: () => Promise<void>;
}

export const CardOficina = ({ oficina, refresh }: Props) => {
  return (
    <Container>
      <WallPaper id={oficina.of_id} />
      <Card.Body>
        <Card.Title>{oficina.tema?.t_nome}</Card.Title>
        <Card.Text>{oficina.of_descricao || "Sem descrição"}</Card.Text>
        <Card.Text>
          <strong>Alunos inscritos: </strong>
          {!!oficina.matriculas.length
            ? oficina.matriculas.length
            : "Sem inscrição"}
        </Card.Text>
      </Card.Body>
      <Col
        md="auto"
        className="d-flex align-items-center justify-content-start gap-2 p-2"
      >
        <Button
          variant="primary"
          onClick={() =>
            ModalGerenciarPresencas({
              oficina,
            })
          }
        >
          <IoMdCheckboxOutline className="mb-1 me-1" />
          Registrar presença
        </Button>

        <Button variant="success" onClick={() => ModalGerenciarCertificados({
          oficina
        })}>
          Gerenciar certificado
        </Button>
      </Col>
    </Container>
  );
};
