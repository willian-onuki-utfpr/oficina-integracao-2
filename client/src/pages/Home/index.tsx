import { Alert, Button, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";
import { serviceOficinaProfessor } from "./services/buscarOficinasDoProfessor";
import { serviceRelatorioOficina } from "./services/buscarRelatorioOficinas";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import type { IOficinaProfessor } from "./interfaces";
import { Container, Content, ListaOficinas, Toolbar } from "./styles";
import { CardOficina } from "./components/CardOficina";
import { RelatorioOficinasPDF } from "./components/RelatorioOficinas";

interface Props {}

export const Home = ({}: Props) => {
  const { usuario } = useAuth();
  const [oficinas, setOficinas] = useState<Partial<IOficinaProfessor>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGerandoRelatorio, setIsGerandoRelatorio] = useState(false);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const resOficinas =
        await serviceOficinaProfessor.buscarOficinasDoProfessor(usuario!.id);

      setOficinas(resOficinas);
    } catch (error) {
      toast.error("Ocorreu um erro ao listar as oficinas criadas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGerarRelatorio = async () => {
    setIsGerandoRelatorio(true);
    try {
      const data = await serviceRelatorioOficina.buscarRelatorio();

      const geradoEm = new Date().toLocaleString("pt-BR");

      const blob = await pdf(
        <RelatorioOficinasPDF oficinas={data} geradoEm={geradoEm} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "relatorio-oficinas.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Relatório gerado com sucesso.");
    } catch (error) {
      toast.error("Ocorreu um erro ao gerar o relatório.");
    } finally {
      setIsGerandoRelatorio(false);
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
          <Toolbar>
            <Button
              variant="outline-secondary"
              disabled={isGerandoRelatorio}
              onClick={handleGerarRelatorio}
            >
              {isGerandoRelatorio ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Gerando relatório...
                </>
              ) : (
                "Gerar relatório oficinas"
              )}
            </Button>
          </Toolbar>

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
