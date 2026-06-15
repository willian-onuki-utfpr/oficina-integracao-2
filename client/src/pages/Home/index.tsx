import { Alert, Card, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";
import { serviceOficinaProfessor } from "./services/buscarOficinasDoProfessor";
import { useEffect, useState } from "react";
import type { IOficinaProfessor } from "./interfaces";
import { Container, Content, ListaOficinas } from "./styles";
import { CardOficina } from "./components/CardOficina";

interface Props {}

export const Home = ({}: Props) => {
  const { usuario } = useAuth();
  const [oficinas, setOficinas] = useState<Partial<IOficinaProfessor>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const resOficinas =
        await serviceOficinaProfessor.buscarOficinasDoProfessor(usuario.id);

      setOficinas(resOficinas);
    } catch (error) {
      toast.error("Ocorreu um erro ao listar as oficinas criadas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

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
          {!oficinas.length ? (
              <Alert variant="secondary" className="m-4">
                Não há oficinas cadastradas no momento.
              </Alert>
          ) : (
            <ListaOficinas>
              {oficinas.map((oficina, index) => (
                <CardOficina
                  key={`card-oficina-${oficina.of_id}-${index}`}
                  oficina={oficina}
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
