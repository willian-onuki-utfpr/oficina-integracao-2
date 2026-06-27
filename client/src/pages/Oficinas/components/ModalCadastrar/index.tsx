import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Form, Modal } from "react-bootstrap";
import { type InstanceProps, create } from "react-modal-promise";
import type {
  IAula,
  IConfiguracaoOficina,
  IOficina,
  IOficinaTutor,
} from "../../interface";
import type { IUsuario } from "../../../Usuarios/interface";
import { buscarProfessores } from "../../services/usuarios/buscarProfessores";
import Select from "react-select";
import { diasDaSemana, diasMap } from "../../helper";
import { eachDayOfInterval, getDay, parse } from "date-fns";
import { buscarTemas } from "../../../Temas/services/buscarTemas";
import type { ITema } from "../../../Temas/inteface";
import { criarOficina } from "../../services/oficina/criarOficina";

interface Props {}

type FormData = Record<keyof IOficina, string>;

const PromiseModal = ({
  isOpen,
  onResolve,
}: Props & InstanceProps<unknown>) => {
  const [oficina, setOficina] = useState<Partial<FormData>>(
    {} as Partial<FormData>,
  );
  const [temas, setTemas] = useState<Partial<ITema>[]>([]);
  const [temaSelecionado, setTemaSelecionado] = useState("");

  const [configuracao, setConfiguracao] = useState<
    Partial<IConfiguracaoOficina>
  >({} as Partial<IConfiguracaoOficina>);

  const [professores, setProfessores] = useState<Partial<IUsuario>[]>([]);
  const [tutores, setTutores] = useState<{ label: string; value: number }[]>(
    [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!temaSelecionado) novosErros.tema = "Selecione um tema";

    if (!oficina.of_carga_horaria)
      novosErros.of_carga_horaria = "Informe a carga horária";

    if (!oficina.of_data_inicio)
      novosErros.of_data_inicio = "Informe a data inicial";

    if (!oficina.of_data_fim) novosErros.of_data_fim = "Informe a data final";

    if (!configuracao.co_horario_inicio)
      novosErros.co_horario_inicio = "Informe o horário inicial";

    if (!configuracao.co_horario_fim)
      novosErros.co_horario_fim = "Informe o horário final";

    if (!configuracao.co_dia_semana)
      novosErros.co_dia_semana = "Selecione um dia da semana";

    if (!oficina.of_professor_responsavel)
      novosErros.of_professor_responsavel = "Selecione um professor";

    if (!oficina.of_limite_faltas)
      novosErros.of_limite_faltas = "Informe o limite de faltas";

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  };
  const formularioValido = useMemo(
    () =>
      !!temaSelecionado &&
      !!oficina.of_carga_horaria &&
      !!oficina.of_data_inicio &&
      !!oficina.of_data_fim &&
      !!configuracao.co_horario_inicio &&
      !!configuracao.co_horario_fim &&
      !!configuracao.co_dia_semana &&
      !!oficina.of_professor_responsavel &&
      !!oficina.of_limite_faltas,
    [temaSelecionado, oficina, configuracao],
  );
  const handleGerarAulas = () => {
    const datas = eachDayOfInterval({
      start: parse(oficina.of_data_inicio!, "yyyy-MM-dd", new Date()),
      end: parse(oficina.of_data_fim!, "yyyy-MM-dd", new Date()),
    });
    const aulas = [] as Partial<IAula>[];
    let count = 1;
    for (const data of datas) {
      const diaSemana = getDay(data);

      if (diasMap[configuracao.co_dia_semana! as keyof typeof diasMap] === diaSemana) {
        aulas.push({
          a_titulo: `Aula ${count}`,
          a_conteudo: "",
          a_data: data,
          a_hora_inicio: configuracao.co_horario_inicio,
          a_hora_fim: configuracao.co_horario_fim,
        });
        count++;
      }
    }

    return aulas;
  };

  const handleSubmit = async () => {
    const formularioValido = validarFormulario();

    if (!formularioValido) return;

    const aulas = handleGerarAulas();

    const tutoresSelecionados = tutores.map(
      (t) => ({ usu_id: t.value }) as Partial<IOficinaTutor>,
    );

    const oficinaParaCriar = {
      ...oficina,
      t_id: Number(temaSelecionado),
      of_carga_horaria: Number(oficina.of_carga_horaria),
      of_limite_faltas: Number(oficina.of_limite_faltas),
      of_professor_responsavel: Number(oficina.of_professor_responsavel),
      configuracoes: [configuracao],
      tutores: tutoresSelecionados,
      aulas,
    };

    await criarOficina(oficinaParaCriar as unknown as Partial<IOficina>);
    onResolve();
  };

  const fetch = async () => {
    const resProfessores = await buscarProfessores();
    const resTemas = await buscarTemas();

    setProfessores(resProfessores ?? []);
    setTemas(resTemas ?? []);
  };

  const opcoesTutores = useMemo(
    () =>
      professores.filter(
        (p) => p.usu_id !== Number(oficina.of_professor_responsavel),
      ),
    [oficina.of_professor_responsavel, professores],
  );

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={isOpen} onHide={() => onResolve()} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col
          md="auto"
          className="d-flex flex-column gap-3"
          style={{
            height: "100%",
            maxHeight: "500px",
            overflow: "auto",
            paddingRight: "1rem",
          }}
        >
          <Form.Group>
            <Form.Label>Tema *</Form.Label>
            <Form.Select
              value={temaSelecionado}
              onChange={(e) => setTemaSelecionado(e.target.value)}
            >
              <option value="">Selecione...</option>
              {temas.map((t) => (
                <option value={t.t_id}>{t.t_nome}</option>
              ))}
              <Form.Control.Feedback type="invalid">
                {errors.tema}
              </Form.Control.Feedback>{" "}
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
            <Form.Label>Carga horária semanal *</Form.Label>
            <Form.Control
              value={oficina.of_carga_horaria || ""}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_carga_horaria: e.target.value.replace(/[^0-9]/g, ""),
                }))
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.of_carga_horaria}
            </Form.Control.Feedback>
          </Form.Group>

          <Col md="auto" className="d-flex w-100 gap-3">
            <Form.Group style={{width: "280px"}}>
              <Form.Label>Data inicial *</Form.Label>
              <Form.Control
                type="date"
                value={oficina.of_data_inicio || ""}
                onChange={(e) =>
                  setOficina((prev) => ({
                    ...prev,
                    of_data_inicio: e.target.value,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.of_data_inicio}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group style={{width: "280px"}}>
              <Form.Label>Data final *</Form.Label>
              <Form.Control
                type="date"
                value={oficina.of_data_fim || ""}
                onChange={(e) =>
                  setOficina((prev) => ({
                    ...prev,
                    of_data_fim: e.target.value,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.of_data_final}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group style={{width: "280px"}}>
              <Form.Label>Horário inicial *</Form.Label>
              <Form.Control
                type="time"
                value={configuracao.co_horario_inicio || ""}
                onChange={(e) =>
                  setConfiguracao((prev) => ({
                    ...prev,
                    co_horario_inicio: e.target.value,
                  }))
                }
              />

              <Form.Control.Feedback type="invalid">
                {errors.co_horario_inicio}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group style={{width: "280px"}}>
              <Form.Label>Horário final *</Form.Label>
              <Form.Control
                type="time"
                value={configuracao.co_horario_fim || ""}
                onChange={(e) =>
                  setConfiguracao((prev) => ({
                    ...prev,
                    co_horario_fim: e.target.value,
                  }))
                }
              />

              <Form.Control.Feedback type="invalid">
                {errors.co_horario_fim}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <ButtonGroup>
            {diasDaSemana.map((value) => (
              <Button
                variant={
                  configuracao.co_dia_semana === value ? "success" : "secondary"
                }
                onClick={() =>
                  setConfiguracao((prev) => ({
                    ...prev,
                    co_dia_semana: value,
                  }))
                }
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
          {!!errors.co_dia_semana && (
            <small className="text-danger">{errors.co_dia_semana}</small>
          )}
          <Form.Group>
            <Form.Label>Professor *</Form.Label>
            <Form.Select
              value={oficina.of_professor_responsavel}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_professor_responsavel: e.target.value,
                }))
              }
            >
              <option value="">Selecione...</option>
              {professores.map((p) => (
                <option value={p.usu_id}>{p.usu_nome}</option>
              ))}
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {errors.of_professor_responsavel}
            </Form.Control.Feedback>
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
                value: p.usu_id!,
                label: p.usu_nome!,
              }))}
              onChange={(selected) => setTutores([...selected])}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Limite de faltas *</Form.Label>
            <Form.Control
              value={oficina.of_limite_faltas || ""}
              onChange={(e) =>
                setOficina((prev) => ({
                  ...prev,
                  of_limite_faltas: e.target.value.replace(/[^0-9]/g, ""),
                }))
              }
            />

            <Form.Control.Feedback type="invalid">
              {errors.of_limite_faltas}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onResolve()}>
          Cancelar
        </Button>
        <Button
          disabled={!formularioValido}
          variant="success"
          onClick={handleSubmit}
        >
          Criar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalCadastrar = create(PromiseModal);
