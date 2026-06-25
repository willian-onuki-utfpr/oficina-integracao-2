import { Button, Col, Modal } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import { PDFViewer } from "@react-pdf/renderer";
import { CertificadoPDF } from "../../../../components/CertificadoPDF";
import type { IUsuario } from "../../../Usuarios/interface";
import type { IOficina } from "../../../Oficinas/interface";
import type { ICertificado } from "../../interface";

interface Props {
  usuario: Partial<IUsuario>;
  oficina: Partial<IOficina>;
  certificado: Partial<ICertificado>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  usuario,
  oficina,
  certificado,
}: Props & InstanceProps<unknown>) => {
  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Certificado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col md="auto" className="d-flex h-100">
          <PDFViewer width="100%" height="100%" style={{
            flex: 1
          }}>
            <CertificadoPDF
              usuario={usuario}
              oficina={oficina}
              certificado={certificado}
            />
          </PDFViewer>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Fechar 
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalCertificado = create(PromiseModal);
