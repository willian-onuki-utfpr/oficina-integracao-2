import { API, stubGetAs, stubPostAs, stubPutAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve abrir o modal de presenças a partir do card de oficina.
// - Deve exibir o seletor de aulas.
// - Deve exibir mensagem "Selecione uma aula" antes de selecionar.
// - Cenário 1: Quando não há presenças registradas, deve criar lista vazia e
//   exibir botão "Registrar Presenças".
// - Cenário 2: Quando já há presenças, deve preencher o formulário e exibir
//   botão "Editar Presenças".
// - Deve permitir marcar todos os alunos como presente via checkbox.
// - Deve permitir marcar todos os alunos como ausente via checkbox.
// - Os checkboxes "Todos presentes" e "Todos ausentes" são mutuamente exclusivos.
// - Deve registrar presenças com sucesso (POST).
// - Deve editar presenças com sucesso (PUT).
// - Deve desabilitar o botão de salvar se há campos sem resposta.
// - Deve fechar o modal ao clicar em Fechar.
// ──────────────────────────────────────────────────────────────────────────────

describe('Presenças', () => {
  const abrirModalPresencas = () => {
    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
    cy.contains('button', 'Registrar presença').click();
    cy.get('.modal').should('be.visible');
  };

  it('abre o modal de gerenciamento de presenças', () => {
    abrirModalPresencas();
    cy.contains('Gerenciar Presenças').should('be.visible');
  });

  it('exibe o seletor de aulas com as opções carregadas', () => {
    abrirModalPresencas();
    cy.get('.modal').within(() => {
      cy.contains('label', 'Aula').should('be.visible');
      cy.get('select').contains('Aula 1').should('exist');
      cy.get('select').contains('Aula 2').should('exist');
    });
  });

  it('exibe mensagem para selecionar uma aula antes de carregar presenças', () => {
    abrirModalPresencas();
    cy.get('.modal').within(() => {
      cy.contains('Selecione uma aula.').should('be.visible');
    });
  });

  // ── Cenário 1 – Sem presenças registradas ───────────────────────────────────

  describe('Cenário 1 – Sem presenças registradas (Registrar)', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/presenca/aula/1`, { body: [] }).as('getPresencasVazias');
      abrirModalPresencas();
    });

    it('exibe lista de alunos para preenchimento ao selecionar aula', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencasVazias');
      cy.get('.modal').within(() => {
        cy.contains('Ana Pereira').should('be.visible');
      });
    });

    it('exibe botão "Registrar Presenças" quando não há registros', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencasVazias');
      cy.get('.modal').within(() => {
        cy.contains('button', 'Registrar Presenças').should('be.visible');
      });
    });

    it('desabilita o botão de registrar enquanto há campos sem resposta', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencasVazias');
      cy.get('.modal').within(() => {
        cy.contains('button', 'Registrar Presenças').should('be.disabled');
      });
    });

    it('registra presenças com sucesso após preencher todas as respostas', () => {
      cy.intercept('POST', `${API}/presenca`, { statusCode: 201 }).as('registrar');

      // Seleciona aula ANTES de registrar o intercept de refetch,
      // para que o Cypress (LIFO) não o use na primeira chamada GET.
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencasVazias');

      // Agora que o primeiro GET já foi consumido, registramos o refetch.
      cy.intercept('GET', `${API}/presenca/aula/1`, { fixture: 'presencas.json' }).as(
        'refetch',
      );

      cy.get('.modal').within(() => {
        cy.get('tbody tr').first().find('select').select('true');
        cy.contains('button', 'Registrar Presenças').click();
      });

      cy.wait('@registrar');
      cy.contains('Presenças registradas com sucesso.').should('be.visible');
    });
  });

  // ── Cenário 2 – Presenças já registradas ────────────────────────────────────

  describe('Cenário 2 – Presenças já registradas (Editar)', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/presenca/aula/1`, { fixture: 'presencas.json' }).as(
        'getPresencas',
      );
      abrirModalPresencas();
    });

    it('preenche o formulário com os registros existentes', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencas');
      cy.get('.modal').within(() => {
        cy.contains('Ana Pereira').should('be.visible');
      });
    });

    it('exibe botão "Editar Presenças" quando já há registros', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencas');
      cy.get('.modal').within(() => {
        cy.contains('button', 'Editar Presenças').should('be.visible');
      });
    });

    it('edita presenças com sucesso', () => {
      cy.intercept('PUT', `${API}/presenca`, { statusCode: 200 }).as('editar');

      // Seleciona aula antes de registrar o refetch para não interferir
      // no primeiro GET (LIFO do Cypress).
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getPresencas');

      // Refetch registrado somente após o primeiro GET ser consumido.
      cy.intercept('GET', `${API}/presenca/aula/1`, { fixture: 'presencas.json' }).as(
        'refetch',
      );

      cy.get('.modal').within(() => {
        cy.contains('button', 'Editar Presenças').click();
      });

      cy.wait('@editar');
      cy.contains('Presenças atualizadas com sucesso.').should('be.visible');
    });
  });

  // ── Marcar todos ────────────────────────────────────────────────────────────

  describe('Funcionalidade "Marcar todos"', () => {
    beforeEach(() => {
      cy.intercept('GET', `${API}/presenca/aula/1`, { body: [] }).as('getVazio');
      abrirModalPresencas();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Aula').parent().find('select').select('1');
      });
      cy.wait('@getVazio');
    });

    it('marca todos os alunos como presente ao checar "Marcar todos como presente"', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Marcar todos como presente').click();
        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).find('select').should('have.value', 'true');
        });
      });
    });

    it('marca todos os alunos como ausente ao checar "Marcar todos como ausente"', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Marcar todos como ausente').click();
        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).find('select').should('have.value', 'false');
        });
      });
    });

    it('desmarca "presente" ao marcar "ausente" (mutuamente exclusivos)', () => {
      cy.get('.modal').within(() => {
        cy.contains('label', 'Marcar todos como presente').click();
        cy.contains('label', 'Marcar todos como ausente').click();
        cy.get('input#checkbox-marcar-todos-presente').should('not.be.checked');
        cy.get('input#checkbox-marcar-todos-ausente').should('be.checked');
      });
    });
  });

  it('fecha o modal ao clicar em Fechar', () => {
    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
    cy.contains('button', 'Registrar presença').click();
    cy.get('.modal').within(() => {
      cy.contains('button', 'Fechar').click();
    });
    cy.get('.modal').should('not.exist');
  });
});
