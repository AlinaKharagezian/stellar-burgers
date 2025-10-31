describe('Тестирование страницы конструктора бургера', () => {

    const BUN_NAME = 'Краторная булка N-200i';
    const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
    const ORDER_NUMBER = 92532;
    const MODAL_MAIN_NAME = 'Мясо бессмертных моллюсков Protostomia';
    const MODAL_MAIN_CALORIES = '420';
    const MODAL_MAIN_PROTEINS = '433';
    const MODAL_MAIN_FAT = '244';
    const MODAL_MAIN_CARBOHYDRATES = '33';

    const SELECTOR = {
        INGREDIENT_CARD: '[data-cy="ingredient-card"]',
        CONSTRUCTOR_AREA: '[data-cy="burger-constructor"]',
        PLACE_ORDER_BUTTON: '[data-cy="place-order-button"]',
        MODAL: '[data-cy="modal"]',
        MODAL_CLOSE: '[data-cy="modal-close"]',
        MODAL_OVERLAY: '[data-cy="modal-overlay"]',
        ORDER_NUMBER: '[data-cy="order-number"] h2',
        ADD_BUTTON: 'button:contains("Добавить")',
        BUN_TOP: '[data-cy="constructor-bun-top"]',
        BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
        INGREDIENT_ITEM: '[data-cy="constructor-ingredient-item"]',
        MODAL_NAME: '[data-cy="modal-ingredient-name"]',
        MODAL_CALORIES: '[data-cy="modal-ingredient-calories"]',
        MODAL_PROTEINS: '[data-cy="modal-ingredient-proteins"]',
        MODAL_FAT: '[data-cy="modal-ingredient-fat"]',
        MODAL_CARBOHYDRATES: '[data-cy="modal-ingredient-carbohydrates"]'
    };

    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');

        window.localStorage.setItem('refreshToken', 'mock-refresh-token');
        cy.setCookie('accessToken', 'mock-access-token');

        cy.visit('/');
        cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
        cy.clearCookie('accessToken');
        cy.clearLocalStorage('refreshToken');
    });

    it('должен открывать и закрывать модальное окно ингредиента', () => {
        cy.contains(MODAL_MAIN_NAME).closest(SELECTOR.INGREDIENT_CARD).click();
        const modal = cy.get(SELECTOR.MODAL);
        modal.should('be.visible');

        cy.get(SELECTOR.MODAL).should('be.visible').within(() => {
            cy.get(SELECTOR.MODAL_NAME).should('have.text', MODAL_MAIN_NAME);
            cy.get(SELECTOR.MODAL_CALORIES).should('have.text', MODAL_MAIN_CALORIES);
            cy.get(SELECTOR.MODAL_PROTEINS).should('have.text', MODAL_MAIN_PROTEINS);
            cy.get(SELECTOR.MODAL_FAT).should('have.text', MODAL_MAIN_FAT);
            cy.get(SELECTOR.MODAL_CARBOHYDRATES).should('have.text', MODAL_MAIN_CARBOHYDRATES);
        });

        cy.get(SELECTOR.MODAL_CLOSE).click();
        modal.should('not.exist');

        cy.contains(BUN_NAME).closest(SELECTOR.INGREDIENT_CARD).click();
        cy.get(SELECTOR.MODAL_OVERLAY).click({ force: true });
        cy.get(SELECTOR.MODAL).should('not.exist');
    });

    it('должен позволять собрать бургер и оформить заказ', () => {
        const constructorArea = cy.get(SELECTOR.CONSTRUCTOR_AREA);

        cy.contains(BUN_NAME).closest(SELECTOR.INGREDIENT_CARD).find(SELECTOR.ADD_BUTTON).click();
        cy.contains(MAIN_NAME).closest(SELECTOR.INGREDIENT_CARD).find(SELECTOR.ADD_BUTTON).click();

        cy.get(SELECTOR.BUN_TOP).should('exist').contains(BUN_NAME);
        cy.get(SELECTOR.BUN_BOTTOM).should('exist').contains(BUN_NAME);
        cy.get(SELECTOR.INGREDIENT_ITEM).should('exist').contains(MAIN_NAME);

        cy.get(SELECTOR.PLACE_ORDER_BUTTON).should('be.visible').click();
        cy.wait('@postOrder');

        cy.get(SELECTOR.MODAL).should('be.visible');
        cy.get(SELECTOR.ORDER_NUMBER).contains(ORDER_NUMBER);

        cy.get(SELECTOR.MODAL_CLOSE).click();
        cy.get(SELECTOR.MODAL).should('not.exist');

        cy.get(SELECTOR.INGREDIENT_ITEM).should('not.exist');
        cy.get(SELECTOR.BUN_TOP).should('not.exist');
        cy.get(SELECTOR.BUN_BOTTOM).should('not.exist');

        cy.contains('Выберите булки').should('be.visible');
        cy.contains('Выберите начинку').should('be.visible');
        
        constructorArea.should('not.contain', MAIN_NAME);
    });
});