import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Spinner } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type { IOficina } from "../../interface";
import type { ITema } from "../../../Temas/inteface";
import type { IUsuario } from "../../../Usuarios/interface";
import { buscarProfessores } from "../../services/usuarios/buscarProfessores";
import { buscarTemas } from "../../../Temas/services/buscarTemas";
import Select from "react-select";
import { editarOficina } from "../../services/oficina/editarOficina";

interface Props {
  oficinaCriada: Partial<IOficina>;
}

const PromiseModal = ({
  isOpen,
  onResolve,
  oficinaCriada,
}: Props & InstanceProps<unknown>) => {
  const [oficina, setOficina] = useState<Partial<IOficina>>(oficinaCriada);
  const [temas, setTemas] = useState<Partial<ITema>[]>([]);
  const [temaSelecionado, setTemaSelecionado] = useState(
    String(oficinaCriada.tema?.t_id) || "",
  );
  const [professores, setProfessores] = useState<Partial<IUsuario>[]>([]);
  const [tutores, setTutores] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const tutoresOriginais = oficinaCriada.tutores?.map((t) => t.usu_id) ?? [];

    const tutoresSelecionados = tutores.map((t) => Number(t.value));

    const tutoresParaAdicionar = tutoresSelecionados
      .filter((usu_id) => !tutoresOriginais.includes(usu_id))
      .map((usu_id) => ({
        of_id: oficinaCriada.of_id,
        usu_id,
      }));

    const tutoresParaExcluir = tutoresOriginais
      .filter((usu_id) => !tutoresSelecionados.includes(usu_id))
      .map((usu_id) => ({
        of_id: oficinaCriada.of_id,
        usu_id,
      }));

    await editarOficina({
      ...oficina,
      t_id: Number(temaSelecionado),
    }, tutoresParaAdicionar, tutoresParaExcluir);
    setIsLoading(false);
    onResolve();
  };

  const opcoesTutores = useMemo(
    () =>
      professores.filter(
        (p) => p.usu_id !== Number(oficina.of_professor_responsavel),
      ),
    [oficina.of_professor_responsavel, professores],
  );

  const fetch = async () => {
    const resProfessores = await buscarProfessores();
    const resTemas = await buscarTemas();

    const tutoresSelecionados = oficinaCriada.tutores?.map((t) => ({
      label: resProfessores?.find((p) => p.usu_id === t.usu_id)?.usu_nome,
      value: t.usu_id,
    }));
    setTutores(tutoresSelecionados);
    setProfessores(resProfessores);
    setTemas(resTemas);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col md="auto" className="d-flex flex-column gap-3">
          <Form.Group>
            <Form.Label>Tema</Form.Label>
            <Form.Select
              value={temaSelecionado}
              onChange={(e) => setTemaSelecionado(e.target.value)}
            >
              <option value="">Selecione...</option>
              {temas.map((t) => (
                <option value={t.t_id}>{t.t_nome}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Descricao</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={oficina.of_descricao || ""}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_descricao: e.target.value,
                }))
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Professor</Form.Label>
            <Form.Select
              value={oficina.of_professor_responsavel}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_professor_responsavel: Number(e.target.value),
                }))
              }
            >
              <option value="0">Selecione...</option>
              {professores.map((p) => (
                <option value={p.usu_id}>{p.usu_nome}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Tutores</Form.Label>
            <Select
              isMulti
              isClearable
              closeMenuOnSelect={false}
              placeholder="Selecione..."
              value={tutores}
              options={opcoesTutores.map((p) => ({
                value: p.usu_id,
                label: p.usu_nome,
              }))}
              onChange={(selected) => setTutores([...selected])}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Limite de faltas</Form.Label>
            <Form.Control
              value={oficina.of_limite_faltas || ""}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_limite_faltas: Number(
                    e.target.value.replace(/[^0-9]/g, ""),
                  ),
                }))
              }
            />
          </Form.Group>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Cancelar
        </Button>
        <Button disabled={isLoading} variant="success" onClick={handleSubmit}>
          {isLoading ? (
            <Spinner animation="border" size="sm" className="mx-4" />
          ) : (
            "Editar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalEditar = create(PromiseModal);
