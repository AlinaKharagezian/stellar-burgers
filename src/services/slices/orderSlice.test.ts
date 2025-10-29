import ordersSlice, {
  clearCurrentOrder,
  createOrder,
  fetchFeeds,
  fetchOrderByNumber,
  fetchUserOrders
} from './orderSlice';
import { mockOrder } from './mockData';
import { TOrder } from '../../utils/types';

describe('Тестирование редьюсера заказов ordersSlice', () => {
  const initialState: {
    feeds: TOrder[];
    userOrders: TOrder[];
    orderRequest: boolean;
    currentOrder: TOrder | null;
    isLoading: boolean;
    error: string | null;
    total: number;
    totalToday: number;
  } = {
    feeds: [],
    userOrders: [],
    orderRequest: false,
    currentOrder: null,
    isLoading: false,
    error: null,
    total: 0,
    totalToday: 0
  };

  it('должен возвращать начальное состояние', () => {
    expect(ordersSlice(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен очищать currentOrder при clearCurrentOrder', () => {
    const stateWithOrder = { ...initialState, currentOrder: mockOrder };
    const action = clearCurrentOrder();
    const newState = ordersSlice(stateWithOrder, action);
    expect(newState.currentOrder).toBeNull();
  });

  describe('Обработка асинхронного экшена createOrder', () => {
    it('должен устанавливать orderRequest в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const newState = ordersSlice(initialState, action);
      expect(newState.orderRequest).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен записывать currentOrder и сбрасывать orderRequest при fulfilled', () => {
      const mockPayload = { order: mockOrder, name: mockOrder.name };
      const action = { type: createOrder.fulfilled.type, payload: mockPayload };
      const requestingState = { ...initialState, orderRequest: true };
      const newState = ordersSlice(requestingState, action);
      expect(newState.orderRequest).toBe(false);
      expect(newState.currentOrder).toEqual(mockOrder);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ошибку и сбрасывать orderRequest при rejected', () => {
      const errorMessage = 'Ошибка при оформлении заказа';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const requestingState = { ...initialState, orderRequest: true };
      const newState = ordersSlice(requestingState, action);
      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.currentOrder).toBeNull();
    });
  });

  describe('Обработка асинхронного экшена fetchFeeds', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const newState = ordersSlice(initialState, action);
      expect(newState.isLoading).toBe(true);
    });

    it('должен записывать feeds, total, totalToday и сбрасывать isLoading при fulfilled', () => {
      const mockPayload = {
        orders: [mockOrder],
        total: 16526,
        totalToday: 159
      };
      const action = { type: fetchFeeds.fulfilled.type, payload: mockPayload };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.feeds).toEqual([mockOrder]);
      expect(newState.total).toBe(16526);
      expect(newState.totalToday).toBe(159);
    });

    it('должен записывать ошибку при rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('Обработка асинхронного экшена fetchUserOrders', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const newState = ordersSlice(initialState, action);
      expect(newState.isLoading).toBe(true);
    });

    it('должен записывать userOrders и сбрасывать isLoading при fulfilled', () => {
      const mockPayload = [mockOrder];
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockPayload
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.userOrders).toEqual([mockOrder]);
    });

    it('должен записывать ошибку при rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('Обработка асинхронного экшена fetchOrderByNumber', () => {
    it('должен устанавливать isLoading в true при pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const newState = ordersSlice(initialState, action);
      expect(newState.isLoading).toBe(true);
    });

    it('должен записывать currentOrder (первый из массива) при fulfilled', () => {
      const mockPayload = { orders: [mockOrder] };
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockPayload
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.currentOrder).toEqual(mockOrder);
    });

    it('должен записывать ошибку при rejected', () => {
      const errorMessage = 'Ошибка загрузки деталей заказа';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const loadingState = { ...initialState, isLoading: true };
      const newState = ordersSlice(loadingState, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
