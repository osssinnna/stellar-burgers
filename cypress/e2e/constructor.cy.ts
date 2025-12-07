/// <reference types="cypress" />

const testUrl = 'http://localhost:4000/';
const ingredientTextClass = '.text_type_main-default';
const modalsRoot = '#modals';

const bunName = 'Тестовая булка';
const mainName = 'Тестовая начинка';
const sauceName = 'Тестовый соус';

const orderButtonText = 'Оформить заказ';
const orderNumberText = '123456';

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

    cy.visit(testUrl);
    cy.wait('@getIngredients');
  });

  it('отображает список ингредиентов из моковых данных', () => {
    cy.contains(bunName).should('exist');
    cy.contains(mainName).should('exist');
    cy.contains(sauceName).should('exist');
  });

  it('добавляет ингредиент из списка в конструктор', () => {
    cy.contains(bunName).should('exist');

    cy.contains(ingredientTextClass, bunName)
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Выберите булки').should('not.exist');
    cy.contains(bunName).should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.contains(ingredientTextClass, bunName).first().click();

    cy.get(modalsRoot).within(() => {
      cy.contains('Описание ингредиента').should('exist');
      cy.contains(bunName).should('exist');
    });

    cy.get(modalsRoot).within(() => {
      cy.get('button').first().click();
    });

    cy.get(modalsRoot).children().should('have.length', 0);
  });

  it('создаёт заказ и очищает конструктор', () => {
    cy.visit(testUrl, {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=Bearer test-access-token; path=/;';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.contains(ingredientTextClass, bunName)
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains(ingredientTextClass, mainName)
      .first()
      .closest('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('button', orderButtonText).click();

    cy.wait('@createOrder');

    cy.get(modalsRoot).within(() => {
      cy.contains(orderNumberText).should('exist');
    });

    cy.get(modalsRoot).within(() => {
      cy.get('button').first().click();
    });

    cy.get(modalsRoot).children().should('have.length', 0);

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
