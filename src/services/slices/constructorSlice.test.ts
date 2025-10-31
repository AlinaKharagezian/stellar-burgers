import constructorSlice, {
  addIngredient,
  deleteIngredient,
  reorderIngredient,
  resetConstructor,
  TMovePayload
} from './constructorSlice';
import { mockBun, mockMain, mockMain2, mockApiIngredient } from './mockData';
import { TConstructorIngredient } from '../../utils/types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substring(7))
}));

describe('Тестирование редьюсера конструктора бургера constructorSlice', () => {
  const initialState: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  } = {
    bun: null,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(constructorSlice(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Обработка экшена добавления ингредиента addIngredient', () => {
    it('должен добавлять булку (bun)', () => {
      const action = addIngredient(mockApiIngredient);
      const newState = constructorSlice(initialState, action);
      expect(newState.bun).toEqual(
        expect.objectContaining({
          ...mockApiIngredient,
          id: expect.stringContaining('mock-uuid-')
        })
      );
      expect(newState.ingredients).toEqual([]);
    });

    it('должен заменять существующую булку новой', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newApiBun = {
        ...mockApiIngredient,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const action = addIngredient(newApiBun);
      const newState = constructorSlice(stateWithBun, action);
      expect(newState.bun).toEqual(
        expect.objectContaining({
          ...newApiBun,
          id: expect.stringContaining('mock-uuid-')
        })
      );
    });

    it('должен добавлять начинку (main/sauce)', () => {
      const apiMainIngredient = { ...mockMain, id: undefined, __v: 0 };
      const action = addIngredient(apiMainIngredient);
      const newState = constructorSlice(initialState, action);
      expect(newState.bun).toBeNull();
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(
        expect.objectContaining({
          ...apiMainIngredient,
          id: expect.stringContaining('mock-uuid-')
        })
      );
    });

    it('должен добавлять вторую начинку', () => {
      const stateWithMain = { ...initialState, ingredients: [mockMain] };
      const apiMain2Ingredient = { ...mockMain2, id: undefined, __v: 0 };
      const action = addIngredient(apiMain2Ingredient);
      const newState = constructorSlice(stateWithMain, action);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[1]).toEqual(
        expect.objectContaining({
          ...apiMain2Ingredient,
          id: expect.stringContaining('mock-uuid-')
        })
      );
    });
  });

  describe('Обработка экшена удаления ингредиента deleteIngredient', () => {
    it('должен удалять указанную начинку по id', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockMain, mockMain2]
      };
      const action = deleteIngredient(mockMain.id);
      const newState = constructorSlice(stateWithIngredients, action);
      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients).toEqual([mockMain2]);
    });

    it('не должен изменять состояние, если id не найден', () => {
      const stateWithIngredients = { ...initialState, ingredients: [mockMain] };
      const action = deleteIngredient('non-existent-uuid');
      const newState = constructorSlice(stateWithIngredients, action);
      expect(newState.ingredients).toEqual([mockMain]);
    });
  });

  describe('Обработка экшена изменения порядка reorderIngredient', () => {
    it('должен перемещать ингредиент с индекса from на индекс to', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockMain, mockMain2]
      };
      const payload: TMovePayload = { from: 0, to: 1 };
      const action = reorderIngredient(payload);
      const newState = constructorSlice(stateWithIngredients, action);
      expect(newState.ingredients).toEqual([mockMain2, mockMain]);
    });

    it('должен корректно перемещать вверх', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockMain, mockMain2]
      };
      const payload: TMovePayload = { from: 1, to: 0 };
      const action = reorderIngredient(payload);
      const newState = constructorSlice(stateWithIngredients, action);
      expect(newState.ingredients).toEqual([mockMain2, mockMain]);
    });

    it('не должен изменять массив, если индексы совпадают', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockMain, mockMain2]
      };
      const payload: TMovePayload = { from: 0, to: 0 };
      const action = reorderIngredient(payload);
      const newState = constructorSlice(stateWithIngredients, action);
      expect(newState.ingredients).toEqual([mockMain, mockMain2]);
    });
  });

  describe('Обработка экшена сброса конструктора resetConstructor', () => {
    it('должен возвращать состояние к начальному', () => {
      const filledState = { bun: mockBun, ingredients: [mockMain, mockMain2] };
      const action = resetConstructor();
      const newState = constructorSlice(filledState, action);
      expect(newState).toEqual(initialState);
    });
  });
});
