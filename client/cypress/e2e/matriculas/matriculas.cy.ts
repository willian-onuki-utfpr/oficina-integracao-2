import { API, stubGetAs, stubPostAs, stubPutAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve exibir as oficinas disponíveis para inscrição (status padrão).
// - Deve exibir alerta quando não há oficinas disponíveis.
// - Deve exibir as oficinas em que o aluno está inscrito ao selecionar "Inscritos".
// - Deve exibir alerta quando o aluno não possui inscrições.
// - Deve abrir modal de confirmação ao clicar em "Inscrever-se".
// - Deve cancelar a inscrição ao clicar em Cancelar na confirmação.
// - Deve inscrever o aluno na oficina após confirmar.
// - Deve exibir aviso quando o aluno já está inscrito (422).
// - Deve abrir modal de confirmação ao cancelar inscrição.
// - Deve cancelar a desinscrição ao clicar em Cancelar.
// - Deve cancelar a inscrição do aluno após confirmar.
// - Deve abrir o modal "Mais informações" da oficina.
// - Deve exibir o botão de frequência para oficinas inscritas sem certificado.
// - Deve exibir o botão "Certificado" quando o certificado está disponibilizado.
// ──────────────────────────────────────────────────────────────────────────────

describe('Matrículas (Aluno)', () => {
  const setupAvailableOficinas = () => {
    cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, {
      fixture: 'oficinas-disponiveis.json',
    }).as('getDisponiveis');
  };

  const setupEnrolledOficinas = () => {
    cy.intercept('GET', `${API}/matricula/aluno/2`, {
      fixture: 'oficinas-matriculadas.json',
    }).as('getMatriculadas');
  };

  // ── Listagem ─────────────────────────────────────────────────────────────────

  describe('Listagem de oficinas', () => {
    it('exibe as oficinas disponíveis para inscrição por padrão', () => {
      setupAvailableOficinas();
      cy.loginAsAluno('/aluno/oficinas');
      cy.wait('@getDisponiveis');
      cy.waitForLoader();
      cy.contains('Programação Web').should('be.visible');
    });

    it('exibe alerta quando não há oficinas disponíveis', () => {
      cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] }).as(
        'vazio',
      );
      cy.loginAsAluno('/aluno/oficinas');
      cy.wait('@vazio');
      cy.contains('Não há oficinas disponíveis para inscrição no momento.').should(
        'be.visible',
      );
    });

    it('exibe as oficinas inscritas ao selecionar "Inscritos"', () => {
      setupAvailableOficinas();
      setupEnrolledOficinas();
      cy.loginAsAluno('/aluno/oficinas');
      cy.wait('@getDisponiveis');
      cy.waitForLoader();

      cy.contains('label', 'Status').parent().find('select').select('matriculado');
      cy.wait('@getMatriculadas');
      cy.contains('Programação Web').should('be.visible');
    });

    it('exibe alerta quando o aluno não possui inscrições', () => {
      setupAvailableOficinas();
      cy.intercept('GET', `${API}/matricula/aluno/2`, { body: [] }).as('semMatriculas');
      cy.loginAsAluno('/aluno/oficinas');
      cy.wait('@getDisponiveis');
      cy.waitForLoader();

      cy.contains('label', 'Status').parent().find('select').select('matriculado');
      cy.wait('@semMatriculas');
      cy.contains('Você ainda não possui inscrições em oficinas.').should('be.visible');
    });
  });

  // ── Inscrição ────────────────────────────────────────────────────────────────

  describe('Inscrição em oficina', () => {
    beforeEach(() => {
      setupAvailableOficinas();
      cy.loginAsAluno('/aluno/oficinas');
      cy.wait('@getDisponiveis');
      cy.waitForLoader();
    });

    it('solicita confirmação ao clicar em Inscrever-se', () => {
      cy.contains('button', 'Inscrever-se').click();
      cy.get('.modal').should('be.visible');
      cy.contains('Você realmente deseja se inscrever nessa oficina?').should(
        'be.visible',
      );
    });

    it('não realiza inscrição ao cancelar a confirmação', () => {
      cy.contains('button', 'Inscrever-se').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
      cy.contains('Programação Web').should('be.visible');
    });

    it('inscreve o aluno na oficina após confirmar', () => {
      cy.intercept('POST', `${API}/matricula`, { statusCode: 201 }).as('matricular');
      cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] }).as(
        'refetch',
      );

      cy.contains('button', 'Inscrever-se').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@matricular');
      cy.contains('Inscrição realizada com sucesso.').should('be.visible');
    });

    it('exibe aviso quando o aluno já está inscrito (422)', () => {
      cy.intercept('POST', `${API}/matricula`, { statusCode: 422 }).as('jaInscrito');

      cy.contains('button', 'Inscrever-se').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@jaInscrito');
      cy.contains('Já está inscrito nesta oficina.').should('be.visible');
    });

    it('abre o modal "Mais informações" ao clicar no botão', () => {
      cy.contains('button', 'Mais informações').click();
      cy.get('.modal').should('be.visible');
    });
  });

  // ── Cancelamento de inscrição ────────────────────────────────────────────────

  describe('Cancelamento de inscrição', () => {
    beforeEach(() => {
      setupEnrolledOficinas();
      cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] });
      cy.loginAsAluno('/aluno/oficinas');

      // Navegar para a aba "Inscritos"
      cy.contains('label', 'Status').parent().find('select').select('matriculado');
      cy.wait('@getMatriculadas');
      cy.waitForLoader();
    });

    it('solicita confirmação ao cancelar a inscrição', () => {
      cy.contains('button', 'Cancelar inscrição').click();
      cy.get('.modal').should('be.visible');
      cy.contains('Você realmente deseja cancelar a inscrição dessa oficina?').should(
        'be.visible',
      );
    });

    it('mantém a inscrição ao cancelar a confirmação', () => {
      cy.contains('button', 'Cancelar inscrição').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
      cy.contains('Programação Web').should('be.visible');
    });

    it('cancela a inscrição após confirmar', () => {
      cy.intercept('PUT', `${API}/matricula/**`, { statusCode: 200 }).as('cancelar');
      cy.intercept('GET', `${API}/matricula/aluno/2`, { body: [] }).as('refetch');

      cy.contains('button', 'Cancelar inscrição').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@cancelar');
      cy.contains('Inscrição cancelada com sucesso.').should('be.visible');
    });
  });

  // ── Certificado disponibilizado ──────────────────────────────────────────────

  describe('Acesso ao certificado', () => {
    it('exibe botão "Certificado" quando certificado está disponibilizado', () => {
      cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] });
      cy.intercept('GET', `${API}/matricula/aluno/2`, {
        body: [
          {
            of_id: 1,
            t_id: 1,
            of_descricao: 'Oficina de programação web moderna',
            of_data_inicio: '2026-07-01',
            of_data_fim: '2026-09-30',
            of_carga_horaria: 2,
            of_limite_faltas: 3,
            of_professor_responsavel: 1,
            certificado_disponibilizado: true,
            tema: { t_id: 1, t_nome: 'Programação Web' },
          },
        ],
      }).as('getComCertificado');

      cy.loginAsAluno('/aluno/oficinas');
      cy.contains('label', 'Status').parent().find('select').select('matriculado');
      cy.wait('@getComCertificado');
      cy.waitForLoader();

      cy.contains('button', 'Certificado').should('be.visible');
    });

    it('exibe botão "Frequência" para oficinas inscritas sem certificado', () => {
      setupEnrolledOficinas();
      cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] });
      cy.loginAsAluno('/aluno/oficinas');

      cy.contains('label', 'Status').parent().find('select').select('matriculado');
      cy.wait('@getMatriculadas');
      cy.waitForLoader();

      cy.contains('button', 'Frequência').should('be.visible');
    });
  });
});
