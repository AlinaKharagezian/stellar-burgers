import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientsSlice';
import ordersSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import constructorSlice from './slices/constructorSlice';

const rootReducer = combineReducers({
  allIngredients: ingredientsSlice,
  orders: ordersSlice,
  user: userSlice,
  burger: constructorSlice
});

describe('Тестирование корневого редьюсера rootReducer', () => {
  it('должен возвращать начальное состояние для всех слайсов при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@UNKNOWN_ACTION' });
    expect(initialState).toHaveProperty('allIngredients');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('burger');
    expect(initialState.allIngredients).toEqual({
      allIngredients: [],
      isLoading: false,
      error: null
    });
  });
});
