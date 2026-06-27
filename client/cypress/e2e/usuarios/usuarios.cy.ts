import { API, stubDeleteAs, stubGetAs, stubPostAs, stubPutAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve listar os usuários cadastrados.
// - Deve filtrar usuários por nome em tempo real.
// - Deve filtrar usuários por e-mail em tempo real.
// - Deve filtrar usuários por tipo.
// - Deve exibir botão para limpar filtros quando algum filtro estiver ativo.
// - Deve limpar filtros ao clicar em "Limpar filtros".
// - Deve exibir alerta quando não há usuários.
// - Deve abrir o modal de cadastro ao clicar em Adicionar.
// - Deve manter o botão Cadastrar desabilitado com campos inválidos.
// - Deve validar senha com menos de 6 caracteres.
// - Deve cadastrar um novo usuário com sucesso.
// - Deve exibir aviso quando o e-mail já está cadastrado (422).
// - Deve abrir o modal de edição com os dados do usuário pré-preenchidos.
// - Deve editar um usuário com sucesso.
// - Deve solicitar confirmação antes de excluir.
// - Deve cancelar a exclusão sem remover o usuário.
// - Deve excluir o usuário após confirmar.
// - Não deve exibir o próprio usuário logado na lista.
// ──────────────────────────────────────────────────────────────────────────────

describe('Usuários', () => {
  beforeEach(() => {
    stubGetAs('/usuario', 'usuarios.json', 'getUsuarios');
    cy.loginAsProfessor('/usuarios');
    cy.wait('@getUsuarios');
    cy.waitForLoader();
  });

  it('lista os usuários cadastrados', () => {
    cy.contains('Carlos Silva').should('be.visible');
    cy.contains('Ana Pereira').should('be.visible');
  });

  it('não exibe o próprio usuário logado na lista', () => {
    // O professor logado tem id=1; os fixtures têm ids 10 e 11
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length', 2);
    cy.contains('td', 'João Professor').should('not.exist');
  });

  it('filtra usuários por nome em tempo real', () => {
    cy.get('input[placeholder="Filtrar por nome"]').type('Carlos');
    cy.contains('Carlos Silva').should('be.visible');
    cy.contains('Ana Pereira').should('not.exist');
  });

  it('filtra usuários por e-mail em tempo real', () => {
    cy.get('input[placeholder="Filtrar por e-mail"]').type('ana@');
    cy.contains('Ana Pereira').should('be.visible');
    cy.contains('Carlos Silva').should('not.exist');
  });

  it('filtra usuários pelo tipo "Professor"', () => {
    cy.contains('label', 'Tipo').parent().find('select').select('professor');
    cy.contains('Carlos Silva').should('be.visible');
    cy.contains('Ana Pereira').should('not.exist');
  });

  it('filtra usuários pelo tipo "Aluno"', () => {
    cy.contains('label', 'Tipo').parent().find('select').select('aluno');
    cy.contains('Ana Pereira').should('be.visible');
    cy.contains('Carlos Silva').should('not.exist');
  });

  it('exibe botão Limpar filtros quando um filtro está ativo', () => {
    cy.get('input[placeholder="Filtrar por nome"]').type('x');
    cy.contains('button', 'Limpar filtros').should('be.visible');
  });

  it('limpa os filtros ao clicar em Limpar filtros', () => {
    cy.get('input[placeholder="Filtrar por nome"]').type('Carlos');
    cy.contains('button', 'Limpar filtros').click();
    cy.contains('Carlos Silva').should('be.visible');
    cy.contains('Ana Pereira').should('be.visible');
  });

  it('exibe alerta quando não há usuários cadastrados', () => {
    cy.intercept('GET', `${API}/usuario`, { body: [] }).as('vazio');
    cy.visit('/usuarios', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token-professor');
        win.localStorage.setItem(
          'usuario',
          JSON.stringify({ id: 1, nome: 'João Professor', email: 'professor@utfpr.edu.br', tipo: 'professor' }),
        );
      },
    });
    cy.wait('@vazio');
    cy.contains('Nenhum usuário cadastrado').should('be.visible');
  });

  // ── Cadastro ────────────────────────────────────────────────────────────────

  describe('Cadastro de usuário', () => {
    it('abre o modal de cadastro ao clicar em Adicionar', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal').contains('Cadastrar').should('be.visible');
    });

    it('mantém o botão Cadastrar desabilitado com campos inválidos', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cadastrar').should('be.disabled');
      });
    });

    it('exibe erro de validação para senha menor que 6 caracteres', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.get('input[placeholder="Digite a senha"]').type('abc');
        cy.contains('A senha deve possuir no mínimo 6 caracteres').should('be.visible');
      });
    });

    it('exibe erro de validação para e-mail inválido', () => {
      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.get('input[placeholder="Digite o e-mail"]').type('emailinvalido');
        cy.contains('Informe um e-mail válido').should('be.visible');
      });
    });

    it('cadastra um novo usuário com sucesso', () => {
      stubPostAs('/usuario', 'criarUsuario', 201);
      stubGetAs('/usuario', 'usuarios.json', 'refetch');

      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.get('input[placeholder="Digite o nome"]').type('Novo Usuário');
        cy.get('select').select('aluno');
        cy.get('input[placeholder="Digite o e-mail"]').type('novo@utfpr.edu.br');
        cy.get('input[placeholder="Digite a senha"]').type('senha123');
        cy.contains('button', 'Cadastrar').click();
      });

      cy.wait('@criarUsuario');
      cy.get('.modal').should('not.exist');
    });

    it('exibe toast de aviso quando o e-mail já está cadastrado (422)', () => {
      cy.intercept('POST', `${API}/usuario`, { statusCode: 422 }).as('conflito');

      cy.contains('button', 'Adicionar').click();
      cy.get('.modal').within(() => {
        cy.get('input[placeholder="Digite o nome"]').type('Duplicado');
        cy.get('select').select('aluno');
        cy.get('input[placeholder="Digite o e-mail"]').type('carlos@utfpr.edu.br');
        cy.get('input[placeholder="Digite a senha"]').type('senha123');
        cy.contains('button', 'Cadastrar').click();
      });

      cy.wait('@conflito');
      cy.contains('Já existe um usuário cadastrado com esse email.').should('be.visible');
      cy.get('.modal').should('be.visible');
    });
  });

  // ── Edição ──────────────────────────────────────────────────────────────────

  describe('Edição de usuário', () => {
    it('abre o modal de edição com os dados do usuário pré-preenchidos', () => {
      cy.get('tbody tr').first().find('button').first().click();
      cy.get('.modal').should('be.visible');
      cy.get('.modal').within(() => {
        cy.contains('Editar').should('be.visible');
        cy.get('input[placeholder="Digite o nome"]').should('have.value', 'Carlos Silva');
      });
    });

    it('edita um usuário com sucesso', () => {
      stubPutAs('/usuario/**', 'editarUsuario');
      stubGetAs('/usuario', 'usuarios.json', 'refetch');

      cy.get('tbody tr').first().find('button').first().click();
      cy.get('.modal').within(() => {
        cy.get('input[placeholder="Digite o nome"]').clear().type('Carlos Atualizado');
        // O campo senha é obrigatório (required) mesmo na edição;
        // sem ele o form fica inválido e o botão permanece desabilitado.
        cy.get('input[placeholder="Digite a senha"]').type('senha123');
        cy.contains('button', 'Editar').click();
      });

      cy.wait('@editarUsuario');
      cy.get('.modal').should('not.exist');
    });
  });

  // ── Exclusão ────────────────────────────────────────────────────────────────

  describe('Exclusão de usuário', () => {
    it('solicita confirmação antes de excluir', () => {
      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').should('be.visible');
      cy.contains('Tem certeza que deseja excluir esse usuário?').should('be.visible');
    });

    it('cancela a exclusão sem remover o usuário', () => {
      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Cancelar').click();
      });
      cy.get('.modal').should('not.exist');
      cy.contains('Carlos Silva').should('be.visible');
    });

    it('exclui o usuário após confirmar', () => {
      stubDeleteAs('/usuario/**', 'excluir');
      cy.intercept('GET', `${API}/usuario`, { body: [] }).as('refetch');

      cy.get('tbody tr').first().find('button').last().click();
      cy.get('.modal').within(() => {
        cy.contains('button', 'Confirmar').click();
      });

      cy.wait('@excluir');
    });
  });
});
