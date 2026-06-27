import { API, stubDeleteAs, stubGetAs, stubPostAs, stubPutAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve listar os temas cadastrados.
// - Deve filtrar temas por nome em tempo real.
// - Deve exibir alerta quando não há temas.
// - Deve abrir o modal de cadastro ao clicar em Adicionar.
// - Deve manter o botão Cadastrar desabilitado com o campo vazio.
// - Deve cadastrar um tema com sucesso.
// - Deve exibir aviso quando o nome já está em uso (422).
// - Deve abrir o modal de edição com o nome pré-preenchido.
// - Deve editar um tema com sucesso.
// - Deve exibir aviso de duplicidade ao editar (422).
// - Deve solicitar confirmação antes de excluir.
// - Deve cancelar a exclusão sem remover o tema.
// - Deve excluir o tema após confirmar.
// ──────────────────────────────────────────────────────────────────────────────

describe('Temas', () => {
  beforeEach(() => {
    stubGetAs('/tema', 'temas.json', 'getTemas');
    cy.loginAsProfessor('/temas');
    cy.wait('@getTemas');
    cy.waitForLoader();
  });

  it('lista os temas cadastrados', () => {
    cy.contains('Programação Web').should('be.visible');
    cy.contains('Inteligência Artificial').should('be.visible');
  });

  it('filtra temas por nome em tempo real', () => {
    cy.get('input[placeholder="Filtrar por nome"]').type('Programação');
    cy.contains('Programação Web').should('be.visible');
    cy.contains('Inteligência Artificial').should('not.exist');
  });

  it('exibe alerta quando não há temas cadastrados', () => {
    cy.intercept('GET', `${API}/tema`, { body: [] }).as('vazio');
    cy.visit('/temas', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token-professor');
        win.localStorage.setItem(
          'usuario',
          JSON.stringify({ id: 1, nome: 'João Professor', email: 'professor@utfpr.edu.br', tipo: 'professor' }),
        );
      },
    });
    cy.wait('@vazio');
    cy.contains('Nenhum tema cadastrado').should('be.visible');
  });

  // ── Cadastro ────────────────────────────────────────────────────────────────

  describe('Cadastro de tema', () => {
    it('abre o modal de cadastro ao clicar em Adicionar', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal').contains('Cadastrar').should('be.visible');
    });

    it('mantém o botão Cadastrar desabilitado com campo vazio', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cadastrar').should('be.disabled');
      });
    });

    it('habilita o botão Cadastrar ao digitar o nome', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Nome').parent().find('input').type('Novo Tema');
        cy.contains('button', 'Cadastrar').should('not.be.disabled');
      });
    });

    it('cadastra um tema com sucesso', () => {
      stubPostAs('/tema', 'criarTema', 201);
      stubGetAs('/tema', 'temas.json', 'refetch');

      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Nome').parent().find('input').type('Robótica');
        cy.contains('button', 'Cadastrar').click();
      });

      cy.wait('@criarTema');
      cy.get('.modal').should('not.exist');
    });

    it('exibe aviso quando o nome do tema já existe (422)', () => {
      cy.intercept('POST', `${API}/tema`, { statusCode: 422 }).as('conflito');

      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Nome').parent().find('input').type('Programação Web');
        cy.contains('button', 'Cadastrar').click();
      });

      cy.wait('@conflito');
      cy.contains('Já existe um tema cadastrado com esse nome.').should('be.visible');
      cy.get('.modal').should('be.visible');
    });

    it('fecha o modal ao clicar em Cancelar', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
    });
  });

  // ── Edição ──────────────────────────────────────────────────────────────────

  describe('Edição de tema', () => {
    it('abre o modal de edição com o nome pré-preenchido', () => {
      cy.get('tbody tr').first().find('button').first().click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal').within(() => {
        cy.contains('Editar').should('be.visible');
        cy.contains('label', 'Nome').parent().find('input').should('have.value', 'Programação Web');
      });
    });

    it('edita um tema com sucesso', () => {
      stubPutAs('/tema/**', 'editarTema');
      stubGetAs('/tema', 'temas.json', 'refetch');

      cy.get('tbody tr').first().find('button').first().click();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Nome').parent().find('input').clear().type('Programação Web Atualizada');
        cy.contains('button', 'Editar').click();
      });

      cy.wait('@editarTema');
      cy.get('.modal').should('not.exist');
    });

    it('exibe aviso de duplicidade ao editar (422)', () => {
      cy.intercept('PUT', `${API}/tema/**`, { statusCode: 422 }).as('conflitoEditar');

      cy.get('tbody tr').first().find('button').first().click();
      cy.get('.modal').within(() => {
        cy.contains('label', 'Nome').parent().find('input').clear().type('Inteligência Artificial');
        cy.contains('button', 'Editar').click();
      });

      cy.wait('@conflitoEditar');
      cy.contains('Já existe um tema cadastrado com esse nome.').should('be.visible');
    });
  });

  // ── Exclusão ────────────────────────────────────────────────────────────────

  describe('Exclusão de tema', () => {
    it('solicita confirmação antes de excluir', () => {
      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').should('be.visible');
      cy.contains('Tem certeza que deseja excluir esse tema?').should('be.visible');
    });

    it('cancela a exclusão sem remover o tema', () => {
      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
      cy.contains('Programação Web').should('be.visible');
    });

    it('exclui o tema após confirmar', () => {
      stubDeleteAs('/tema/**', 'excluir');
      stubGetAs('/tema', 'temas.json', 'refetch');

      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@excluir');
    });
  });
});
