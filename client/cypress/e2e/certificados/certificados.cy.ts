import { API, stubGetAs, stubPostAs } from '../../helpers';

// ─── Cenários ──────────────────────────────────────────────────────────────────
// - Deve abrir o modal de gerenciamento de certificados.
// - Deve listar os alunos com suas informações (faltas, limite, aprovado).
// - Deve exibir badge "Sim" para aluno aprovado e "Não" para reprovado.
// - Deve habilitar o botão "Disponibilizar Certificado" apenas para alunos aprovados.
// - Deve exibir "Certificado Disponibilizado" como botão desabilitado para
//   alunos que já receberam o certificado.
// - Deve filtrar alunos por nome em tempo real.
// - Deve disponibilizar certificado individual para aluno aprovado.
// - Deve disponibilizar certificados em lote para todos os aprovados.
// - Deve exibir alerta quando nenhum aluno é encontrado pelo filtro.
// - Deve abrir o modal de edição de faltas ao clicar em "Editar Faltas".
// - Deve editar as faltas de um aluno com sucesso.
// - Não deve permitir valor negativo no campo de faltas.
// ──────────────────────────────────────────────────────────────────────────────

describe('Certificados', () => {
  const abrirModalCertificados = () => {
    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.intercept('GET', `${API}/matricula/alunos-oficina/1`, {
      fixture: 'alunos-oficina.json',
    }).as('getAlunos');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
    cy.contains('button', 'Gerenciar certificado').click();
    cy.get('.modal').should('be.visible');
    cy.wait('@getAlunos');
    // Aguarda o conteúdo renderizar de fato (spinner do modal de certificados sumir)
    cy.contains('.modal', 'Ana Pereira').should('be.visible');
  };

  it('abre o modal de gerenciamento de certificados', () => {
    abrirModalCertificados();
    cy.contains('Gerenciamento de Certificados').should('be.visible');
  });

  it('lista os alunos com nome, faltas e limite de faltas', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      cy.contains('Ana Pereira').should('be.visible');
      cy.contains('Pedro Alves').should('be.visible');
      cy.contains('Faltas:').should('be.visible');
      cy.contains('Limite de faltas:').should('be.visible');
    });
  });

  it('exibe badge "Sim" para aluno aprovado', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      // Ana Pereira: aprovado = true → badge success
      cy.contains('Ana Pereira')
        .closest('[class*="list-group-item"]')
        .find('.badge.bg-success')
        .should('contain', 'Sim');
    });
  });

  it('exibe badge "Não" para aluno reprovado', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      // Pedro Alves: aprovado = false → badge danger
      cy.contains('Pedro Alves')
        .closest('[class*="list-group-item"]')
        .find('.badge.bg-danger')
        .should('contain', 'Não');
    });
  });

  it('habilita "Disponibilizar Certificado" apenas para alunos aprovados', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      // Ana Pereira aprovada → botão habilitado
      cy.contains('Ana Pereira')
        .closest('[class*="list-group-item"]')
        .contains('button', 'Disponibilizar Certificado')
        .should('not.be.disabled');

      // Pedro Alves reprovado → botão desabilitado
      cy.contains('Pedro Alves')
        .closest('[class*="list-group-item"]')
        .contains('button', 'Disponibilizar Certificado')
        .should('be.disabled');
    });
  });

  it('exibe botão desabilitado "Certificado Disponibilizado" quando já emitido', () => {
    cy.intercept('GET', `${API}/matricula/alunos-oficina/1`, {
      body: [
        {
          usu_id: 11,
          usu_nome: 'Ana Pereira',
          usu_email: 'ana@utfpr.edu.br',
          usu_tipo: 'aluno',
          faltas: 0,
          aprovado: true,
          certificado_disponibilizado: true,
        },
      ],
    }).as('getAlunosCertificado');

    stubGetAs('/oficina/professor/1', 'oficinas-professor.json', 'getOficinas');
    cy.loginAsProfessor('/');
    cy.wait('@getOficinas');
    cy.waitForLoader();
    cy.contains('button', 'Gerenciar certificado').click();
    cy.wait('@getAlunosCertificado');

    cy.get('.modal').within(() => {
      cy.contains('button', 'Certificado Disponibilizado').should('be.disabled');
    });
  });

  it('filtra alunos por nome em tempo real', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      cy.get('input[placeholder="Pesquisar aluno pelo nome..."]').type('Ana');
      cy.contains('Ana Pereira').should('be.visible');
      cy.contains('Pedro Alves').should('not.exist');
    });
  });

  it('exibe alerta quando o filtro não encontra alunos', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      cy.get('input[placeholder="Pesquisar aluno pelo nome..."]').type('ZZZ');
      cy.contains('Nenhum aluno encontrado.').should('be.visible');
    });
  });

  it('disponibiliza certificado individual para aluno aprovado', () => {
    cy.intercept('POST', `${API}/certificado/aluno/`, { statusCode: 201 }).as(
      'emitirIndividual',
    );
    cy.intercept('GET', `${API}/matricula/alunos-oficina/1`, {
      fixture: 'alunos-oficina.json',
    }).as('refetch');

    abrirModalCertificados();

    cy.get('.modal').within(() => {
      cy.contains('Ana Pereira')
        .closest('[class*="list-group-item"]')
        .contains('button', 'Disponibilizar Certificado')
        .click();
    });

    cy.wait('@emitirIndividual');
    cy.contains('Certificado disponibilizado com sucesso.').should('be.visible');
  });

  it('disponibiliza certificados em lote para todos os aprovados', () => {
    cy.intercept('POST', `${API}/certificado/alunos-aprovados/`, { statusCode: 201 }).as(
      'emitirLote',
    );
    cy.intercept('GET', `${API}/matricula/alunos-oficina/1`, {
      fixture: 'alunos-oficina.json',
    }).as('refetch');

    abrirModalCertificados();

    cy.get('.modal').within(() => {
      cy.contains('button', 'Disponibilizar Certificados para Todos os Aprovados').click();
    });

    cy.wait('@emitirLote');
    cy.contains(
      'Certificados disponibilizados para alunos aprovados com sucesso.',
    ).should('be.visible');
  });

  // ── Edição de faltas ────────────────────────────────────────────────────────

  describe('Edição de faltas', () => {
    beforeEach(() => {
      // Regex é mais confiável que glob para sub-paths com IDs numéricos
      cy.intercept('GET', /\/presenca\/faltas\/1\//, { body: 2 }).as('getFaltas');
      abrirModalCertificados();
    });

    it('abre o modal de edição de faltas ao clicar em Editar Faltas', () => {
      // Apenas um modal está aberto aqui (certificados)
      cy.get('.modal').first().within(() => {
        cy.contains('button', 'Editar Faltas').click();
      });
      cy.wait('@getFaltas');
      // Aguarda o segundo modal aparecer no DOM
      cy.get('.modal').should('have.length', 2);
      // Verifica o título dentro do último modal (o de faltas, adicionado por último)
      cy.get('.modal').last().find('.modal-title').should('contain', 'Editar Faltas');
    });

    it('exibe a quantidade atual de faltas', () => {
      cy.get('.modal').first().within(() => {
        cy.contains('button', 'Editar Faltas').first().click();
      });
      cy.wait('@getFaltas');
      cy.contains('2 faltas').should('be.visible');
    });

    it('não permite valor negativo no campo de faltas', () => {
      cy.get('.modal').first().within(() => {
        cy.contains('button', 'Editar Faltas').first().click();
      });
      cy.wait('@getFaltas');

      // Componente usa Math.max(0, valor) — nunca aceita negativos
      cy.contains('.modal-title', 'Editar Faltas')
        .closest('.modal')
        .find('input[type="number"]')
        .clear()
        .type('-5');
      cy.contains('.modal-title', 'Editar Faltas')
        .closest('.modal')
        .find('input[type="number"]')
        .should('have.value', '0');
    });

    it('edita as faltas com sucesso', () => {
      cy.intercept('POST', `${API}/presenca/quantidade`, { statusCode: 200 }).as(
        'editarFaltas',
      );

      // Abre o modal de faltas e aguarda o primeiro GET (LIFO: refetch não pode
      // ser registrado antes, senão sobrescreve o getFaltas do beforeEach)
      cy.get('.modal').first().within(() => {
        cy.contains('button', 'Editar Faltas').click();
      });
      cy.wait('@getFaltas');

      // Somente após o primeiro GET ser consumido registramos o intercept
      // que responde ao GET que vem depois do POST (dentro de editarFaltas())
      cy.intercept('GET', /\/presenca\/faltas\/1\//, { body: 3 }).as('refetch');

      cy.get('.modal').last().within(() => {
        cy.get('input[type="number"]').clear().type('3');
        cy.contains('button', 'Editar').click();
      });

      cy.wait('@editarFaltas');
      cy.contains('Faltas editadas com sucesso').should('be.visible');
    });
  });

  it('fecha o modal ao clicar em Fechar', () => {
    abrirModalCertificados();
    cy.get('.modal').within(() => {
      cy.contains('button', 'Fechar').click();
    });
    cy.get('.modal').should('not.exist');
  });
});
