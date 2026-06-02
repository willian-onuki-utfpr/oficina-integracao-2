import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { Link } from 'react-router-dom';

export function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>
          Sistema de Oficinas
        </Navbar.Brand>

        <Nav>
          <Nav.Link as={Link} to="/">
            Dashboard
          </Nav.Link>

          <Nav.Link as={Link} to="/usuarios">
            Usuários
          </Nav.Link>

          <Nav.Link as={Link} to="/oficinas">
            Oficinas
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}