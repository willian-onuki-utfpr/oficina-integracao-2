import { useEffect, useMemo, useState } from "react";
import { Button, Col, Modal, Spinner, Table } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type { IOficina } from "../../../Oficinas/interface";
import { toast } from "react-toastify";
import type { IPresenca } from "../../../Home/interfaces";
import { api } from "../../../../services/api";

interface Props {
  oficina: Partial<IOficina>;
  usu_id: number;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  oficina,
  usu_id,
}: Props & InstanceProps<unknown>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [presencas, setPresencas] = useState<Partial<IPresenca>[]>([]);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<Partial<IPresenca>[]>(
        `/presenca/aluno/${oficina.of_id}/${usu_id}`,
      );

      setPresencas(data);
    } catch (error) {
      toast.error("Ocorreu um erro ao detalhar a frequência da oficina");
    } finally {
      setIsLoading(false);
    }
  };

  const detalhes = useMemo(() => {
    const aulasPrevistas = oficina.aulas?.length;
    const aulasDadas = presencas.length;
    const faltas = presencas.filter((p) => p.p_presenca === false).length;
    const limiteFaltas = oficina.of_limite_faltas;
    const resFrequencia = aulasDadas <= 0 ? 0 : ((aulasDadas - faltas) / aulasDadas) * 100;

    const frequencia = Number(resFrequencia.toFixed(2));

    return {
      aulasPrevistas,
      aulasDadas,
      faltas,
      limiteFaltas,
      frequencia,
    };
  }, [presencas, oficina]);

  useEffect(() => {
    fetch();
  }, []);
  return (
    <Modal show={isOpen} onHide={() => onResolve()} size="lg"centered>
      <Modal.Header closeButton>
        <Modal.Title>Frequência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Col
            md="auto"
            className="w-100 d-flex align-items-center justify-content-center"
          >
            <Spinner animation="border" />
          </Col>
        ) : (
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Aulas previstas</th>
                <th>Aulas dadas</th>
                <th>Faltas</th>
                <th>Limite de faltas</th>
                <th>Frequência</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{detalhes.aulasPrevistas}</td>
                <td>{detalhes.aulasDadas}</td>
                <td>{detalhes.faltas}</td>
                <td>{detalhes.limiteFaltas}</td>
                <td>{detalhes.frequencia}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalFrequencia = create(PromiseModal);
