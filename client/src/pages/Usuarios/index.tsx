import { Container } from "react-bootstrap";

interface Props {}

export const Usuarios = ({}: Props) => {
  return (
    <Container className="mt-4">
      <h2>Usuários</h2>

      <p>Página de gerenciamento de usuários.</p>
    </Container>
  );
};
