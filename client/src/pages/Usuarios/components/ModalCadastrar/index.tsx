import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { type InstanceProps, create } from "react-modal-promise";
import type { IUsuario } from "../../interface";
import { editarUsuario } from "../../services/editarUsuario";
import { criarUsuario } from "../../services/criarUsuario";
import { useState } from "react";

interface Props {
  usuario?: Partial<IUsuario>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  usuario,
}: Props & InstanceProps<unknown>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IUsuario>({
    mode: "onChange",
    defaultValues: usuario || ({} as Partial<IUsuario>),
  });

  const [isLoading, setIsLoading] = useState(false);
  

  const onSubmit = async (data: Partial<IUsuario>) => {
    setIsLoading(true);
    let status = null
    if (!!usuario?.usu_id) {
      await editarUsuario(data)
    } else {
      status = await criarUsuario(data);
    }

    setIsLoading(false);
    if (status === 422) return;
    onResolve()
  };

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{!!usuario?.usu_id ? "Editar" : "Cadastrar"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Digite o nome"
                  isInvalid={!!errors.usu_nome}
                  {...register("usu_nome", {
                    required: "O nome é obrigatório",
                  })}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.usu_nome?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.usu_tipo}
                    {...register("usu_tipo", {
                      required: "Selecione um tipo de usuário",
                    })}
                  >
                    <option value="">Selecione...</option>

                    <option value="aluno">Aluno</option>

                    <option value="professor">Professor</option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {errors.usu_tipo?.message}
                  </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Digite o e-mail"
                  isInvalid={!!errors.usu_email}
                  {...register("usu_email", {
                    required: "O e-mail é obrigatório",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Informe um e-mail válido",
                    },
                  })}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.usu_email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite a senha"
                  isInvalid={!!errors.usu_senha}
                  {...register("usu_senha", {
                    required: "A senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve possuir no mínimo 6 caracteres",
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.usu_senha?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Cancelar
        </Button>
        <Button disabled={!isValid || isLoading} variant="success" type="submit" form="form">
          {isLoading ? <Spinner animation="border" size="sm" className="mx-4"/> : !!usuario?.usu_id ? "Editar" : "Cadastrar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalCadastrar = create(PromiseModal);
