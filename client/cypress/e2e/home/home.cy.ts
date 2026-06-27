import { API, stubGetAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve exibir as oficinas do professor logado.
// - Deve exibir alerta quando o professor não possui oficinas.
// - Deve exibir o número de alunos inscritos em cada oficina.
// - Deve exibir o botão "Registrar presença" em cada card.
// - Deve exibir o botão "Gerenciar certificado" em cada card.
// - Deve abrir o modal de gerenciamento de presenças.
// - Deve abrir o modal de gerenciamento de certificados.
// - A navbar deve exibir os links de navegação para professor.
// - Aluno não deve ver os links de navegação administrativos.
// ──────────────────────────────────────────────────────────────────────────────

describe('Home (Dashboard do Professor)', () => {
  beforeEach(() => {
    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
  });

  it('exibe as oficinas do professor logado', () => {
    cy.contains('Programação Web').should('be.visible');
  });

  it('exibe alerta quando o professor não tem oficinas', () => {
    cy.intercept('GET', `${API}/oficina/professor/1`, { body: [] }).as('vazio');
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'fake-jwt-token-professor');
        win.localStorage.setItem(
          'usuario',
          JSON.stringify({ id: 1, nome: 'João Professor', email: 'professor@utfpr.edu.br', tipo: 'professor' }),
        );
      },
    });
    cy.wait('@vazio');
    cy.contains('Não há oficinas cadastradas no momento.').should('be.visible');
  });

  it('exibe o número de alunos inscritos em cada card de oficina', () => {
    // A fixture oficinas-professor.json tem 1 matrícula
    cy.contains('Alunos inscritos:').should('be.visible');
    cy.contains('1').should('be.visible');
  });

  it('exibe o botão Registrar presença em cada card', () => {
    cy.contains('button', 'Registrar presença').should('be.visible');
  });

  it('exibe o botão Gerenciar certificado em cada card', () => {
    cy.contains('button', 'Gerenciar certificado').should('be.visible');
  });

  it('abre o modal de gerenciamento de presenças', () => {
    cy.contains('button', 'Registrar presença').click();
    cy.get('.modal').should('be.visible');
    cy.contains('Gerenciar Presenças').should('be.visible');
  });

  it('abre o modal de gerenciamento de certificados', () => {
    cy.intercept('GET', `${API}/matricula/alunos-oficina/1`, {
      fixture: 'alunos-oficina.json',
    }).as('getAlunos');

    cy.contains('button', 'Gerenciar certificado').click();
    cy.get('.modal').should('be.visible');
    cy.contains('Gerenciamento de Certificados').should('be.visible');
    cy.wait('@getAlunos');
  });

  // ── Navbar ──────────────────────────────────────────────────────────────────

  it('exibe os links de navegação para professor', () => {
    cy.contains('a', 'Dashboard').should('be.visible');
    cy.contains('a', 'Usuários').should('be.visible');
    cy.contains('a', 'Oficinas').should('be.visible');
    cy.contains('a', 'Temas').should('be.visible');
  });

  it('exibe o nome do usuário logado no dropdown da navbar', () => {
    cy.contains('João Professor').should('be.visible');
  });

  it('navega para /usuarios ao clicar no link Usuários', () => {
    cy.intercept('GET', `${API}/usuario`, { body: [] });
    cy.contains('a', 'Usuários').click();
    cy.url().should('include', '/usuarios');
  });
});

describe('Home – Aluno não acessa rotas administrativas', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] }).as(
      'getDisponiveis',
    );
    cy.loginAsAluno('/aluno/oficinas');
    cy.wait('@getDisponiveis');
  });

  it('não exibe os links administrativos na navbar', () => {
    cy.contains('a', 'Dashboard').should('not.exist');
    cy.contains('a', 'Usuários').should('not.exist');
    cy.contains('a', 'Oficinas').should('not.exist');
    cy.contains('a', 'Temas').should('not.exist');
  });
});
