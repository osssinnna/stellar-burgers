/// <reference types="cypress" />
describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      fixture: 'order.json'
    }).as('createOrder');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
  });

  it('отображает список ингредиентов из моковых данных', () => {
    cy.contains('Тестовая булка').should('exist');
    cy.contains('Тестовая начинка').should('exist');
    cy.contains('Тестовый соус').should('exist');
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.contains('Тестовая булка').should('exist');

    cy.contains('.text_type_main-default', 'Тестовая булка')
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });
    cy.contains('Выберите булки').should('not.exist');
    cy.contains('Тестовая булка').should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.contains('.text_type_main-default', 'Тестовая булка').first().click();

    cy.get('#modals').within(() => {
      cy.contains('Описание ингредиента').should('exist');
      cy.contains('Тестовая булка').should('exist');
    });

    cy.get('#modals').within(() => {
      cy.get('button').first().click();
    });

    cy.get('#modals').children().should('have.length', 0);
  });

  it('создаёт заказ и очищает конструктор', () => {
    cy.visit('http://localhost:4000/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=Bearer test-access-token; path=/;';
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.contains('.text_type_main-default', 'Тестовая булка')
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('.text_type_main-default', 'Тестовая начинка')
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get('#modals').within(() => {
      cy.contains('123456').should('exist');
    });
    cy.get('#modals').within(() => {
      cy.get('button').first().click();
    });

    cy.get('#modals').children().should('have.length', 0);

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
