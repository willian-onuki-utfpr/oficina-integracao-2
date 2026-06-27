import { API } from '../../helpers';

describe('Login', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  // ─── Cenários ────────────────────────────────────────────────────────────────
  // - Deve exibir o formulário de login.
  // - Deve manter o botão Entrar desabilitado com campos vazios.
  // - Deve exibir erro de validação para e-mail em formato inválido.
  // - Deve realizar login como professor e redirecionar para /.
  // - Deve realizar login como aluno e redirecionar para /aluno/oficinas.
  // - Deve exibir mensagem de erro com credenciais inválidas (401).
  // - Deve armazenar token e usuário no localStorage após login bem-sucedido.
  // - Deve redirecionar para /login ao acessar rota protegida sem autenticação.
  // - Deve realizar logout e limpar o localStorage.
  // ─────────────────────────────────────────────────────────────────────────────

  it('exibe o formulário de login', () => {
    cy.get('input[placeholder="Digite seu e-mail"]').should('be.visible');
    cy.get('input[placeholder="Digite sua senha"]').should('be.visible');
    cy.contains('button', 'Entrar').should('be.visible');
  });

  it('mantém o botão Entrar desabilitado com campos vazios', () => {
    cy.contains('button', 'Entrar').should('be.disabled');
  });

  it('exibe validação para e-mail em formato inválido', () => {
    cy.get('input[placeholder="Digite seu e-mail"]').type('email-sem-arroba');
    cy.get('input[placeholder="Digite sua senha"]').type('senha123');
    cy.contains('E-mail inválido').should('be.visible');
    cy.contains('button', 'Entrar').should('be.disabled');
  });

  it('mantém o botão desabilitado sem senha preenchida', () => {
    cy.get('input[placeholder="Digite seu e-mail"]').type('professor@utfpr.edu.br');
    cy.contains('button', 'Entrar').should('be.disabled');
  });

  it('realiza login como professor e redireciona para /', () => {
    cy.intercept('POST', `${API}/usuario/login`, {
      fixture: 'login-professor.json',
    }).as('login');
    cy.intercept('GET', `${API}/oficina/professor/1`, { body: [] });

    cy.get('input[placeholder="Digite seu e-mail"]').type('professor@utfpr.edu.br');
    cy.get('input[placeholder="Digite sua senha"]').type('senha123');
    cy.contains('button', 'Entrar').click();

    cy.wait('@login');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('realiza login como aluno e redireciona para /aluno/oficinas', () => {
    cy.intercept('POST', `${API}/usuario/login`, {
      fixture: 'login-aluno.json',
    }).as('login');
    cy.intercept('GET', `${API}/matricula/aluno/2/disponiveis`, { body: [] });

    cy.get('input[placeholder="Digite seu e-mail"]').type('aluno@utfpr.edu.br');
    cy.get('input[placeholder="Digite sua senha"]').type('senha123');
    cy.contains('button', 'Entrar').click();

    cy.wait('@login');
    cy.url().should('include', '/aluno/oficinas');
  });

  it('exibe mensagem de erro com credenciais inválidas', () => {
    cy.intercept('POST', `${API}/usuario/login`, {
      statusCode: 401,
      body: { message: 'Credenciais inválidas' },
    }).as('loginFail');

    cy.get('input[placeholder="Digite seu e-mail"]').type('invalido@teste.com');
    cy.get('input[placeholder="Digite sua senha"]').type('senhaerrada');
    cy.contains('button', 'Entrar').click();

    cy.wait('@loginFail');
    cy.contains('E-mail ou senha inválidos.').should('be.visible');
  });

  it('armazena token e usuário no localStorage após login bem-sucedido', () => {
    cy.intercept('POST', `${API}/usuario/login`, {
      fixture: 'login-professor.json',
    }).as('login');
    cy.intercept('GET', `${API}/oficina/professor/1`, { body: [] });

    cy.get('input[placeholder="Digite seu e-mail"]').type('professor@utfpr.edu.br');
    cy.get('input[placeholder="Digite sua senha"]').type('senha123');
    cy.contains('button', 'Entrar').click();

    cy.wait('@login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token-professor');
      const user = JSON.parse(win.localStorage.getItem('usuario') ?? '{}');
      expect(user.tipo).to.equal('professor');
    });
  });

  it('redireciona para /login ao acessar rota protegida sem autenticação', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('realiza logout, limpa o localStorage e volta para /login', () => {
    cy.intercept('GET', `${API}/oficina/professor/1`, { body: [] }).as('home');
    cy.loginAsProfessor('/');
    cy.wait('@home');

    cy.get('#dropdown-usuario').click();
    cy.contains('Sair').click();

    cy.url().should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('usuario')).to.be.null;
    });
  });
});
