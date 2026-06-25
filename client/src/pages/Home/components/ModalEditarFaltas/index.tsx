import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import { toast } from "react-toastify";
import { api } from "../../../../services/api";
import type { IPresenca } from "../../interfaces";

interface Props {
  usu_id: number;
  of_id: number;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  usu_id,
  of_id,
}: Props & InstanceProps<unknown>) => {
  const [faltas, setFaltas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editando, setEditando] = useState(false);

  const editarFaltas = async () => {
    setEditando(true);

    try {
      await api.post("/presenca/quantidade", {
        of_id,
        usu_id,
        quantidade: faltas,
      });

      toast.success("Faltas editadas com sucesso");

      await fetch();

      onResolve();
    } catch (error) {
      toast.error("Ocorreu um erro ao editar as faltas do aluno");
    } finally {
      setEditando(false);
    }
  };

  const fetch = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.get<number>(
        `/presenca/faltas/${of_id}/${usu_id}`,
      );

      setFaltas(data);
    } catch (error) {
      toast.error("Ocorreu um erro ao buscar as faltas do aluno");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Faltas</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <Col className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </Col>
        ) : (
          <>
            <Alert variant="info">
              Informe a quantidade total de faltas do aluno nesta oficina.
            </Alert>

            <Form.Group>
              <Form.Label>
                Quantidade de faltas
              </Form.Label>

              <InputGroup>
                <InputGroup.Text>Faltas</InputGroup.Text>

                <Form.Control
                  type="number"
                  min={0}
                  value={faltas}
                  onChange={(e) =>
                    setFaltas(
                      Math.max(
                        0,
                        Number(e.target.value || 0),
                      ),
                    )
                  }
                />
              </InputGroup>

              <Form.Text muted>
                O valor não pode ser menor que zero.
              </Form.Text>
            </Form.Group>

            <div className="mt-4">
              <strong>Total atual:</strong>{" "}
              {faltas} {faltas === 1 ? "falta" : "faltas"}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={isLoading || editando}
          onClick={() => onResolve()}
        >
          Cancelar
        </Button>

        <Button
          variant="success"
          disabled={isLoading || editando}
          onClick={editarFaltas}
        >
          {editando ? (
            <Spinner
              animation="border"
              size="sm"
              className="mx-3"
            />
          ) : (
            "Editar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalEditarFaltas = create(PromiseModal);