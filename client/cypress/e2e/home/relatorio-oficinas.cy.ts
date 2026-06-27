import { API, stubGetAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve exibir o botão "Gerar relatório oficinas" na página Home.
// - Deve chamar GET /oficina/relatorio ao clicar no botão.
// - Deve desabilitar o botão enquanto o relatório está sendo gerado.
// - Deve exibir spinner e texto "Gerando relatório..." no botão durante a geração.
// - Deve exibir toast de sucesso após gerar o relatório com sucesso.
// - Deve reabilitar o botão após a conclusão bem-sucedida.
// - Deve exibir toast de erro quando o endpoint retorna falha.
// - Deve reabilitar o botão após a conclusão com erro.
// - Deve gerar relatório mesmo quando não há oficinas cadastradas.
// ──────────────────────────────────────────────────────────────────────────────

describe('Relatório de Oficinas', () => {
  beforeEach(() => {
    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
  });

  it('exibe o botão "Gerar relatório oficinas" na página Home', () => {
    cy.contains('button', 'Gerar relatório oficinas').should('be.visible');
  });

  it('chama GET /oficina/relatorio ao clicar no botão', () => {
    stubGetAs('/oficina/relatorio', 'relatorio-oficinas.json', 'getRelatorio');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorio');
  });

  it('desabilita o botão e exibe spinner durante a geração', () => {
    cy.intercept('GET', `${API}/oficina/relatorio`, {
      fixture: 'relatorio-oficinas.json',
      delay: 800,
    }).as('getRelatorio');

    cy.contains('button', 'Gerar relatório oficinas').click();

    cy.contains('button', 'Gerando relatório...')
      .should('be.visible')
      .and('be.disabled');

    cy.get('button').contains('Gerando relatório...')
      .find('.spinner-border')
      .should('exist');

    cy.wait('@getRelatorio');
  });

  it('exibe toast de sucesso após gerar o relatório com sucesso', () => {
    stubGetAs('/oficina/relatorio', 'relatorio-oficinas.json', 'getRelatorio');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorio');

    cy.contains('Relatório gerado com sucesso.', { timeout: 10000 }).should('be.visible');
  });

  it('reabilita o botão após a conclusão bem-sucedida', () => {
    stubGetAs('/oficina/relatorio', 'relatorio-oficinas.json', 'getRelatorio');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorio');

    cy.contains('button', 'Gerar relatório oficinas', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('exibe toast de erro quando o endpoint retorna falha', () => {
    cy.intercept('GET', `${API}/oficina/relatorio`, { statusCode: 500 }).as('getRelatorioErro');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorioErro');

    cy.contains('Ocorreu um erro ao gerar o relatório.').should('be.visible');
  });

  it('reabilita o botão após a conclusão com erro', () => {
    cy.intercept('GET', `${API}/oficina/relatorio`, { statusCode: 500 }).as('getRelatorioErro');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorioErro');

    cy.contains('button', 'Gerar relatório oficinas')
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('gera relatório com sucesso mesmo quando não há oficinas cadastradas', () => {
    cy.intercept('GET', `${API}/oficina/relatorio`, { body: [] }).as('getRelatorioVazio');

    cy.contains('button', 'Gerar relatório oficinas').click();
    cy.wait('@getRelatorioVazio');

    cy.contains('Relatório gerado com sucesso.', { timeout: 10000 }).should('be.visible');
  });
});
