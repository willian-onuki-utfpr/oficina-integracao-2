import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type { ITema } from "../../inteface";
import { editarTema } from "../../services/editarTema";
import { criarTema } from "../../services/criarTema";

interface Props {
  tema?: Partial<ITema>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  tema,
}: Props & InstanceProps<unknown>) => {
  const [isLoading, setIsLoading] = useState(false);

  const [nome, setNome] = useState(tema?.t_nome || "");

  const onSubmit = async () => {
    setIsLoading(true);
    let status = null;
    if (!!tema?.t_id) {
      status = await editarTema({ ...tema, t_nome: nome });
    } else {
      status = await criarTema(nome);
    }

    setIsLoading(false);
    if (status === 422) return;
    onResolve();
  };

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{!!tema?.t_id ? "Editar" : "Cadastrar"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Cancelar
        </Button>
        <Button
          disabled={!nome.length || isLoading}
          variant="success"
          onClick={onSubmit}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" className="mx-4" />
          ) : !!tema?.t_id ? (
            "Editar"
          ) : (
            "Cadastrar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalCadastrar = create(PromiseModal);
