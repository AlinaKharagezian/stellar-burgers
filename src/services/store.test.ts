import { combineReducers } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientsSlice';
import ordersSlice from './slices/orderSlice';
import userSlice from './slices/userSlice';
import constructorSlice from './slices/constructorSlice';
import { initialIngredientsState } from './slices/ingredientsSlice';
import { initialOrdersState } from './slices/orderSlice';
import { initialUserState } from './slices/userSlice';
import { initialConsructorState } from './slices/constructorSlice';

const rootReducer = combineReducers({
  allIngredients: ingredientsSlice,
  orders: ordersSlice,
  user: userSlice,
  burger: constructorSlice
});

describe('Тестирование корневого редьюсера rootReducer', () => {
  it('должен возвращать начальное состояние для всех слайсов при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '@@UNKNOWN_ACTION' });
    expect(initialState.allIngredients).toEqual(initialIngredientsState);
    expect(initialState.orders).toEqual(initialOrdersState);
    expect(initialState.user).toEqual(initialUserState);
    expect(initialState.burger).toEqual(initialConsructorState);
  });
});
