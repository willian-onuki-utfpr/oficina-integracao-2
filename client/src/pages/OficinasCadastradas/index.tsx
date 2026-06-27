import { Alert, Col, Form, Spinner } from "react-bootstrap";
import { Container, Content, ListaOficinas } from "./styles";
import { useEffect, useMemo, useState } from "react";
import type { IOficina } from "../Oficinas/interface";
import { CardOficina } from "./components/CardOficina";
import { buscarOficinasParaMatricular } from "./services/oficina/buscarOficinasParaMatricular";
import { useAuth } from "../../contexts/authContext";
import { buscarOficinasMatriculadas } from "./services/oficina/buscarOficinasMatriculadas";

export interface IOficinaAluno extends IOficina {
  certificado_disponibilizado: boolean
}

interface Props {}

export const OficinasCadastradas = ({}: Props) => {
  const { usuario } = useAuth();
  const [oficinas, setOficinas] = useState<Partial<IOficinaAluno>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const valoresFiltrados = useMemo(() => {
    return oficinas;
  }, [oficinas]);

  const fetch = async () => {
    setIsLoading(true);

    let resOficinas = [] as Partial<IOficina>[];
    if (status === "matriculado") {
      resOficinas = await buscarOficinasMatriculadas(usuario?.id || -1) || [];
    } else {
      resOficinas = await buscarOficinasParaMatricular(usuario?.id || -1) || [];
    }

    setOficinas(resOficinas);
    setIsLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [status]);

  return (
    <Container>
      {!!isLoading ? (
        <Col
          md="auto"
          className="w-100 h-100 d-flex align-items-center justify-content-center"
        >
          <Spinner animation="border" />
        </Col>
      ) : (
        <Content>
          <Col
            md="auto"
            className="mx-4 my-3 d-flex align-items-center justify-content-start gap-3"
          >
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Não inscrito</option>
                <option value="matriculado">Inscritos</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {!valoresFiltrados.length ? (
            status === "matriculado" ? (
              <Alert variant="secondary" className="mx-4">
                Você ainda não possui inscrições em oficinas.
              </Alert>
            ) : (
              <Alert variant="secondary" className="mx-4">
                Não há oficinas disponíveis para inscrição no momento.
              </Alert>
            )
          ) : (
            <ListaOficinas>
              {valoresFiltrados.map((oficina, index) => (
                <CardOficina
                  key={`card-oficina-${oficina.of_id}-${index}`}
                  oficina={oficina}
                  status={status}
                  refresh={fetch}
                />
              ))}
            </ListaOficinas>
          )}
        </Content>
      )}
    </Container>
  );
};
