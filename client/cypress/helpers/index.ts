export const API = 'http://localhost:3000';

/** Stub GET sem alias (use quando não precisa de cy.wait) */
export const stubGet = (path: string, fixture: string) => {
  cy.intercept('GET', `${API}${path}`, { fixture });
};

/** Stub GET com alias para usar cy.wait('@alias') */
export const stubGetAs = (path: string, fixture: string, alias: string) => {
  cy.intercept('GET', `${API}${path}`, { fixture }).as(alias);
};

/** Stub POST com resposta de sucesso */
export const stubPost = (path: string, statusCode = 200, body: object = {}) => {
  cy.intercept('POST', `${API}${path}`, { statusCode, body });
};

/** Stub POST com alias */
export const stubPostAs = (
  path: string,
  alias: string,
  statusCode = 200,
  body: object = {},
) => {
  cy.intercept('POST', `${API}${path}`, { statusCode, body }).as(alias);
};

/** Stub PUT */
export const stubPutAs = (path: string, alias: string, statusCode = 200) => {
  cy.intercept('PUT', `${API}${path}`, { statusCode }).as(alias);
};

/** Stub DELETE */
export const stubDeleteAs = (path: string, alias: string, statusCode = 200) => {
  cy.intercept('DELETE', `${API}${path}`, { statusCode }).as(alias);
};

/** Obtém o modal visível do Bootstrap */
export const getModal = () => cy.get('.modal.show, .modal[style*="display: block"]');

/** Clica em um botão dentro do modal pelo texto */
export const clickModalButton = (text: string) => {
  cy.get('.modal').contains('button', text).click();
};
