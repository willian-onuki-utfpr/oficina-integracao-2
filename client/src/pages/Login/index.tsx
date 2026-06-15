import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { realizarLogin } from "./services/realizarLogin";
import { useAuth } from "../../contexts/authContext";
import type { IUsuario } from "../Usuarios/interface";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
  } = useForm<{
    usu_email: string;
    usu_senha: string;
  }>({
    mode: "onChange",
    defaultValues: {
      usu_email: "",
      usu_senha: "",
    },
  });

  const onSubmit = async (data: Partial<IUsuario>) => {
    try {
      setErro("");
      setLoading(true);

      const response = await realizarLogin(
        data.usu_email,
        data.usu_senha
      );

      login(response);

      navigate(response.usuario.tipo === "aluno" ? "/aluno/oficinas" : "/");
    } catch (error) {
      setErro("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row
        className="vh-100 align-items-center justify-content-center"
      >
        <Col md={4}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">
                Login
              </h4>
            </Card.Header>

            <Card.Body>
              {erro && (
                <Alert variant="danger">
                  {erro}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    E-mail
                  </Form.Label>

                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    isInvalid={!!errors.usu_email}
                    {...register("usu_email", {
                      required:
                        "Informe o e-mail",
                      pattern: {
                        value:
                          /\S+@\S+\.\S+/,
                        message:
                          "E-mail inválido",
                      },
                    })}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.usu_email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Senha
                  </Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    isInvalid={!!errors.usu_senha}
                    {...register("usu_senha", {
                      required:
                        "Informe a senha",
                    })}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.usu_senha?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100"
                  disabled={
                    !isValid || loading
                  }
                >
                  {loading ? (
                    <>
                      <Spinner
                        size="sm"
                        className="me-2"
                      />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};