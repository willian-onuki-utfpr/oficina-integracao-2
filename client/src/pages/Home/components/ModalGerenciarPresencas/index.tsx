import { Button, Modal } from 'react-bootstrap';
import { type InstanceProps, create } from 'react-modal-promise'

interface Props {
}

const PromiseModal= ({ isOpen, onResolve }: Props & InstanceProps<unknown>) => {

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered>
      <Modal.Header closeButton>
        <Modal.Title>Presença</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={() => onResolve()}>
          Fechar     
        </Button>
      </Modal.Footer>
    </Modal>
  );

};

export const ModalGerenciarPresencas = create(PromiseModal)