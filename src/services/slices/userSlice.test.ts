import userSlice, {
  performRegistration,
  performLogin,
  performLogout,
  fetchUserData,
  saveUserData
} from './userSlice';
import { mockUser } from './mockData';
import { TUser } from '../../utils/types';

describe('Тестирование редьюсера пользователя userSlice', () => {
  const initialState: {
    user: TUser | null;
    authResolved: boolean;
    error: string | null;
  } = {
    user: null,
    authResolved: false,
    error: null
  };

  it('должен возвращать начальное состояние', () => {
    expect(userSlice(undefined, { type: '' })).toEqual(initialState);
  });

  describe('Обработка асинхронного экшена performRegistration', () => {
    it('должен сбрасывать error при pending', () => {
      const action = { type: performRegistration.pending.type };
      const newState = userSlice(initialState, action);
      expect(newState.error).toBeNull();
    });

    it('должен записывать user, устанавливать authResolved при fulfilled', () => {
      const mockPayload = {
        user: mockUser,
        accessToken: 'acc',
        refreshToken: 'ref'
      };
      const action = {
        type: performRegistration.fulfilled.type,
        payload: mockPayload
      };
      const newState = userSlice(initialState, action);
      expect(newState.user).toEqual(mockUser);
      expect(newState.authResolved).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать authResolved при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const action = {
        type: performRegistration.rejected.type,
        error: { message: errorMessage }
      };
      const newState = userSlice(initialState, action);
      expect(newState.error).toBe(errorMessage);
      expect(newState.authResolved).toBe(true);
      expect(newState.user).toBeNull();
    });
  });

  describe('Обработка асинхронного экшена performLogin', () => {
    it('должен сбрасывать error при pending', () => {
      const action = { type: performLogin.pending.type };
      const newState = userSlice(initialState, action);
      expect(newState.error).toBeNull();
    });

    it('должен записывать user и устанавливать authResolved при fulfilled', () => {
      const mockPayload = {
        user: mockUser,
        accessToken: 'acc',
        refreshToken: 'ref'
      };
      const action = {
        type: performLogin.fulfilled.type,
        payload: mockPayload
      };
      const newState = userSlice(initialState, action);
      expect(newState.user).toEqual(mockUser);
      expect(newState.authResolved).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать authResolved при rejected', () => {
      const errorMessage = 'Ошибка входа';
      const action = {
        type: performLogin.rejected.type,
        error: { message: errorMessage }
      };
      const newState = userSlice(initialState, action);
      expect(newState.error).toBe(errorMessage);
      expect(newState.authResolved).toBe(true);
      expect(newState.user).toBeNull();
    });
  });

  describe('Обработка асинхронного экшена performLogout', () => {
    it('должен сбрасывать user и устанавливать authResolved при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        authResolved: false
      };
      const action = { type: performLogout.fulfilled.type };
      const newState = userSlice(stateWithUser, action);
      expect(newState.user).toBeNull();
      expect(newState.authResolved).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен сбрасывать user, записывать ошибку и устанавливать authResolved при rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: performLogout.rejected.type,
        error: { message: errorMessage }
      };
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        authResolved: false
      };
      const newState = userSlice(stateWithUser, action);
      expect(newState.user).toBeNull();
      expect(newState.error).toBe(errorMessage);
      expect(newState.authResolved).toBe(true);
    });
  });

  describe('Обработка асинхронного экшена fetchUserData', () => {
    it('должен записывать user и устанавливать authResolved при fulfilled', () => {
      const mockPayload = { user: mockUser };
      const action = {
        type: fetchUserData.fulfilled.type,
        payload: mockPayload
      };
      const newState = userSlice(initialState, action);
      expect(newState.user).toEqual(mockUser);
      expect(newState.authResolved).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('должен сбрасывать user, записывать ошибку и устанавливать authResolved при rejected', () => {
      const errorMessage = 'Ошибка проверки при авторизации';
      const action = {
        type: fetchUserData.rejected.type,
        error: { message: errorMessage }
      };
      const newState = userSlice(initialState, action);
      expect(newState.user).toBeNull();
      expect(newState.error).toBe(errorMessage);
      expect(newState.authResolved).toBe(true);
    });
  });

  describe('Обработка асинхронного экшена saveUserData', () => {
    it('должен обновлять user при fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Иван Петрович' };
      const mockPayload = { user: updatedUser };
      const action = {
        type: saveUserData.fulfilled.type,
        payload: mockPayload
      };
      const stateWithUser = { ...initialState, user: mockUser };
      const newState = userSlice(stateWithUser, action);
      expect(newState.user).toEqual(updatedUser);
      expect(newState.error).toBeNull();
    });

    it('должен записывать ошибку при rejected', () => {
      const errorMessage = 'Ошибка обновления данных профиля';
      const action = {
        type: saveUserData.rejected.type,
        error: { message: errorMessage }
      };
      const stateWithUser = { ...initialState, user: mockUser };
      const newState = userSlice(stateWithUser, action);
      expect(newState.user).toEqual(mockUser);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
