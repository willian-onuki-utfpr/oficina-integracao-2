import { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { type InstanceProps, create } from "react-modal-promise";

import type { IAula } from "../../../../interface";

interface Props {
  aula?: Partial<IAula>;
  of_id: number;
}

type FormData = {
  a_titulo: string;
  a_conteudo: string;
  a_data: string;
  a_hora_inicio: string;
  a_hora_fim: string;
};

const PromiseModal = ({
  isOpen,
  onResolve,
  aula,
  of_id
}: Props & InstanceProps<unknown>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isValid,
      isSubmitting,
    },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      a_titulo: "",
      a_conteudo: "",
      a_data: "",
      a_hora_inicio: "",
      a_hora_fim: "",
    },
  });

  useEffect(() => {
    if (aula?.a_id) {
      reset({
        a_titulo: aula.a_titulo || "",
        a_conteudo: aula.a_conteudo || "",
        a_data: aula.a_data
          ? new Date(aula.a_data)
              .toISOString()
              .split("T")[0]
          : "",
        a_hora_inicio:
          aula.a_hora_inicio || "",
        a_hora_fim:
          aula.a_hora_fim || "",
      });
    }
  }, [aula, reset]);

  const onSubmit = async (
    data: FormData
  ) => {
    const payload = {
      ...data,
      of_id,
      a_id: aula?.a_id,
    };

    onResolve(payload);
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => onResolve()}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {aula?.a_id
            ? "Editar Aula"
            : "Criar Aula"}
        </Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={handleSubmit(
          onSubmit
        )}
      >
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Título *
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Digite o título da aula"
                  isInvalid={
                    !!errors.a_titulo
                  }
                  {...register(
                    "a_titulo",
                    {
                      required:
                        "Preencha o título da aula",
                    }
                  )}
                />

                <Form.Control.Feedback type="invalid">
                  {
                    errors.a_titulo
                      ?.message
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Conteúdo
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Conteúdo da aula"
                  {...register(
                    "a_conteudo"
                  )}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Data *
                </Form.Label>

                <Form.Control
                  type="date"
                  isInvalid={
                    !!errors.a_data
                  }
                  {...register(
                    "a_data",
                    {
                      required:
                        "Selecione a data da aula",
                    }
                  )}
                />

                <Form.Control.Feedback type="invalid">
                  {
                    errors.a_data
                      ?.message
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Hora Início *
                </Form.Label>

                <Form.Control
                  type="time"
                  isInvalid={
                    !!errors.a_hora_inicio
                  }
                  {...register(
                    "a_hora_inicio",
                    {
                      required:
                        "Informe a hora de início",
                    }
                  )}
                />

                <Form.Control.Feedback type="invalid">
                  {
                    errors
                      .a_hora_inicio
                      ?.message
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Hora Fim *
                </Form.Label>

                <Form.Control
                  type="time"
                  isInvalid={
                    !!errors.a_hora_fim
                  }
                  {...register(
                    "a_hora_fim",
                    {
                      required:
                        "Informe a hora de término",
                    }
                  )}
                />

                <Form.Control.Feedback type="invalid">
                  {
                    errors
                      .a_hora_fim
                      ?.message
                  }
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              onResolve()
            }
          >
            Cancelar
          </Button>

          <Button
            variant="success"
            type="submit"
            disabled={
              !isValid ||
              isSubmitting
            }
          >
            {aula?.a_id
              ? "Salvar Alterações"
              : "Criar Aula"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const ModalCadastrarAula =
  create(PromiseModal);