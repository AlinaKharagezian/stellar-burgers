import ingredientsSlice, { fetchIngredients } from './ingredientsSlice';
import { mockApiIngredients } from './mockData';
import { TIngredient } from '../../utils/types';

describe('Тестирование редьюсера ингредиентов ingredientsSlice', () => {
  const initialState: {
    allIngredients: TIngredient[];
    isLoading: boolean;
    error: string | null;
  } = {
    allIngredients: [],
    isLoading: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(ingredientsSlice(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Обработка асинхронного экшена fetchIngredients', () => {
    it('должен устанавливать isLoading в true и сбрасывать error при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsSlice(initialState, action);
      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ингредиенты и устанавливать isLoading в false при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockApiIngredients
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ingredientsSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.allIngredients).toEqual(mockApiIngredients);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать isLoading в false при rejected', () => {
      const errorMessage = 'Не удалось загрузить ингредиенты';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ingredientsSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.allIngredients).toEqual([]);
    });
  });
});
