import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { NavDropdown } from "react-bootstrap";

export function Header() {
  const navigate = useNavigate();

  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Sistema de Oficinas</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Dashboard
          </Nav.Link>

          <Nav.Link as={Link} to="/usuarios">
            Usuários
          </Nav.Link>

          <Nav.Link as={Link} to="/oficinas">
            Oficinas
          </Nav.Link>

          <Nav.Link as={Link} to="/temas">
            Temas 
          </Nav.Link>
        </Nav>

        <Nav>
          <NavDropdown
            align="end"
            title={usuario?.nome || "Usuário"}
            id="dropdown-usuario"
          >
            <NavDropdown.Header>
              <div>
                <strong>{usuario?.nome}</strong>
              </div>

              <small className="text-muted">{usuario?.email}</small>
            </NavDropdown.Header>

            <NavDropdown.Divider />

            {/* <NavDropdown.Item as={Link} to="/perfil">
              Meu Perfil
            </NavDropdown.Item> */}

            <NavDropdown.Item onClick={handleLogout} className="text-danger">
              Sair
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
