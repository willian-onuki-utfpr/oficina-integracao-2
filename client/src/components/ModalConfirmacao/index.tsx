import { Button, Modal } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";

interface Props {
  variant: string;
  message: string;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  message,
  variant,
}: Props & InstanceProps<boolean>) => {
  return (
    <Modal show={isOpen} onHide={() => onResolve(false)} centered>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve(false)}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={() => onResolve(true)}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalConfirmacao = create<Props & InstanceProps<boolean>, boolean>(
  PromiseModal,
);
