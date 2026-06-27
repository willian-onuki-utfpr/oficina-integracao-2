import { API, stubDeleteAs, stubGetAs, stubPostAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve listar as oficinas cadastradas.
// - Deve exibir alerta quando não há oficinas.
// - Deve abrir o modal de cadastro ao clicar em Adicionar.
// - Deve manter o botão Criar desabilitado quando campos obrigatórios estão vazios.
// - Deve habilitar o botão Criar quando todos os campos obrigatórios são preenchidos.
// - Deve gerar aulas automaticamente com base nas datas e dia da semana.
// - Deve cadastrar uma oficina com sucesso.
// - Deve excluir uma oficina após confirmação.
// - Deve cancelar a exclusão de uma oficina.
// - Deve abrir o modal de planejamento de aulas.
// - A lista de tutores deve excluir o professor responsável selecionado.
// ──────────────────────────────────────────────────────────────────────────────

describe('Oficinas', () => {
  const setupStubs = () => {
    stubGetAs('/oficina', 'oficinas.json', 'getOficinas');
    stubGetAs('/usuario/professor', 'professores.json', 'getProfessores');
    stubGetAs('/tema', 'temas.json', 'getTemas');
  };

  beforeEach(() => {
    setupStubs();
    cy.loginAsProfessor('/oficinas');
    cy.wait('@getOficinas');
    cy.waitForLoader();
  });

  it('lista as oficinas cadastradas', () => {
    cy.contains('Programação Web').should('be.visible');
    cy.contains('João Professor').should('be.visible');
  });

  it('exibe alerta quando não há oficinas cadastradas', () => {
    cy.intercept('GET', `${API}/oficina`, { body: [] }).as('vazio');
    cy.intercept('GET', `${API}/usuario/professor`, { fixture: 'professores.json' });
    cy.intercept('GET', `${API}/tema`, { fixture: 'temas.json' });
    cy.visit('/oficinas', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token-professor');
        win.localStorage.setItem(
          'usuario',
          JSON.stringify({ id: 1, nome: 'João Professor', email: 'professor@utfpr.edu.br', tipo: 'professor' }),
        );
      },
    });
    cy.wait('@vazio');
    cy.contains('Nenhuma oficina cadastrada.').should('be.visible');
  });

  // ── Cadastro ────────────────────────────────────────────────────────────────

  describe('Cadastro de oficina', () => {
    beforeEach(() => {
      // Os requests de professores e temas são feitos quando o modal monta,
      // então o clique deve vir antes do wait.
      cy.contains('button', 'Adicionar').click();
      cy.wait(['@getProfessores', '@getTemas']);
      cy.get('.modal').should('be.visible');
    });

    it('abre o modal de cadastro', () => {
      cy.get('.modal').contains('Cadastrar').should('be.visible');
    });

    it('mantém o botão Criar desabilitado com campos obrigatórios vazios', () => {
      cy.get('.modal').within(() => {
        cy.contains('button', 'Criar').should('be.disabled');
      });
    });

    it('habilita o botão Criar quando todos os campos obrigatórios são preenchidos', () => {
      cy.get('.modal').within(() => {
        // Tema
        cy.contains('label', 'Tema *').parent().find('select').select('1');
        // Carga horária
        cy.contains('label', 'Carga horária semanal *')
          .parent()
          .find('input')
          .type('2');
        // Data inicial
        cy.contains('label', 'Data inicial *').parent().find('input').type('2026-07-01');
        // Data final
        cy.contains('label', 'Data final *').parent().find('input').type('2026-09-30');
        // Horário inicial
        cy.contains('label', 'Horário inicial *').parent().find('input').type('19:00');
        // Horário final
        cy.contains('label', 'Horário final *').parent().find('input').type('21:00');
        // Dia da semana
        cy.contains('button', 'Segunda').click();
        // Professor responsável
        cy.contains('label', 'Professor *').parent().find('select').select('1');
        // Limite de faltas
        cy.contains('label', 'Limite de faltas *').parent().find('input').type('3');

        cy.contains('button', 'Criar').should('not.be.disabled');
      });
    });

    it('cadastra uma oficina com sucesso', () => {
      stubPostAs('/oficina', 'criarOficina', 201);
      stubGetAs('/oficina', 'oficinas.json', 'refetch');

      cy.get('.modal').within(() => {
        cy.contains('label', 'Tema *').parent().find('select').select('1');
        cy.contains('label', 'Carga horária semanal *').parent().find('input').type('2');
        cy.contains('label', 'Data inicial *').parent().find('input').type('2026-07-01');
        cy.contains('label', 'Data final *').parent().find('input').type('2026-09-30');
        cy.contains('label', 'Horário inicial *').parent().find('input').type('19:00');
        cy.contains('label', 'Horário final *').parent().find('input').type('21:00');
        cy.contains('button', 'Segunda').click();
        cy.contains('label', 'Professor *').parent().find('select').select('1');
        cy.contains('label', 'Limite de faltas *').parent().find('input').type('3');
        cy.contains('button', 'Criar').click();
      });

      cy.wait('@criarOficina');
      cy.get('.modal').should('not.exist');
    });

    it('aceita somente números no campo Carga horária', () => {
      cy.get('.modal').within(() => {
        const input = cy.contains('label', 'Carga horária semanal *').parent().find('input');
        input.type('abc2def3');
        input.should('have.value', '23');
      });
    });

    it('aceita somente números no campo Limite de faltas', () => {
      cy.get('.modal').within(() => {
        const input = cy.contains('label', 'Limite de faltas *').parent().find('input');
        input.type('x5y');
        input.should('have.value', '5');
      });
    });

    it('fecha o modal ao clicar em Cancelar', () => {
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
    });
  });

  // ── Exclusão ────────────────────────────────────────────────────────────────

  describe('Exclusão de oficina', () => {
    it('solicita confirmação antes de excluir', () => {
      cy.get('tbody tr').first().find('button[class*="danger"]').click();
      cy.get('.modal').should('be.visible');
      cy.contains('Tem certeza que deseja excluir essa oficina?').should('be.visible');
    });

    it('cancela a exclusão sem remover a oficina', () => {
      cy.get('tbody tr').first().find('button[class*="danger"]').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
      cy.contains('Programação Web').should('be.visible');
    });

    it('exclui a oficina após confirmar', () => {
      stubDeleteAs('/oficina/**', 'excluir');
      cy.intercept('GET', `${API}/oficina`, { body: [] }).as('refetch');

      cy.get('tbody tr').first().find('button[class*="danger"]').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@excluir');
    });
  });

  // ── Planejamento de Aulas ────────────────────────────────────────────────────

  describe('Planejamento de aulas', () => {
    it('abre o modal de planejamento de aulas ao clicar no ícone', () => {
      // Endpoint: GET /aula/oficina/:of_id (of_id=1 no fixture)
      cy.intercept('GET', `${API}/aula/oficina/1`, { fixture: 'aulas.json' }).as('getAulas');
      // O primeiro botão de cada linha é o de Planejamento de Aulas
      cy.get('tbody tr').first().find('button').eq(0).click();
      cy.get('.modal').should('be.visible');
      cy.wait('@getAulas');
      cy.contains('Planejamento das aulas').should('be.visible');
    });
  });
});
