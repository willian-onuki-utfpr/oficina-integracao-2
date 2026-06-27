export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login como professor via localStorage (sem passar pela tela de login).
       * @param visitUrl - Rota a visitar após configurar a sessão. Padrão: '/'
       */
      loginAsProfessor(visitUrl?: string): Chainable<void>;

      /**
       * Faz login como aluno via localStorage (sem passar pela tela de login).
       * @param visitUrl - Rota a visitar após configurar a sessão. Padrão: '/aluno/oficinas'
       */
      loginAsAluno(visitUrl?: string): Chainable<void>;

      /**
       * Aguarda o spinner de carregamento desaparecer.
       */
      waitForLoader(): Chainable<void>;
    }
  }
}

const PROFESSOR_SESSION = {
  id: 1,
  nome: 'João Professor',
  email: 'professor@utfpr.edu.br',
  tipo: 'professor',
};

const ALUNO_SESSION = {
  id: 2,
  nome: 'Maria Aluna',
  email: 'aluno@utfpr.edu.br',
  tipo: 'aluno',
};

Cypress.Commands.add('loginAsProfessor', (visitUrl = '/') => {
  cy.visit(visitUrl, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'fake-jwt-token-professor');
      win.localStorage.setItem('usuario', JSON.stringify(PROFESSOR_SESSION));
    },
  });
});

Cypress.Commands.add('loginAsAluno', (visitUrl = '/aluno/oficinas') => {
  cy.visit(visitUrl, {
    onBeforeLoad(win) {
      win.localStorage.setItem('token', 'fake-jwt-token-aluno');
      win.localStorage.setItem('usuario', JSON.stringify(ALUNO_SESSION));
    },
  });
});

Cypress.Commands.add('waitForLoader', () => {
  cy.get('.spinner-border', { timeout: 8000 }).should('not.exist');
});
