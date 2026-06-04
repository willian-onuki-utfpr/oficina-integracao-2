import { Card, Container } from 'react-bootstrap';

interface Props {}

export const Home = ({}: Props) => {

  return (
  <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>
            Sistema de Controle de Oficinas
          </Card.Title>

          <Card.Text>
            Página inicial do sistema.
          </Card.Text>

          <Card.Text>
            Utilize o menu superior para navegar
            entre as páginas.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};