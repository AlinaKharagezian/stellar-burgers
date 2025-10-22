import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface UserData {
  user: TUser | null;
  authResolved: boolean;
  error: string | null;
}

const initialUserState: UserData = {
  user: null,
  authResolved: false,
  error: null
};

export const performRegistration = createAsyncThunk(
  'user/performRegistration',
  registerUserApi
);
export const performLogin = createAsyncThunk('user/performLogin', loginUserApi);
export const performLogout = createAsyncThunk('user/performLogout', logoutApi);
export const fetchUserData = createAsyncThunk('user/fetchUserData', getUserApi);
export const saveUserData = createAsyncThunk(
  'user/saveUserData',
  updateUserApi
);

const userSlice = createSlice({
  name: 'userData',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(performRegistration.pending, (state) => {
        state.error = null;
      })
      .addCase(performRegistration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.authResolved = true;
      })
      .addCase(performRegistration.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка регистрации';
        state.authResolved = true;
      })

      .addCase(performLogin.pending, (state) => {
        state.error = null;
      })
      .addCase(performLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        state.authResolved = true;
      })
      .addCase(performLogin.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка входа';
        state.authResolved = true;
      })

      .addCase(performLogout.fulfilled, (state) => {
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        state.authResolved = true;
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка выхода';
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
        state.user = null;
        state.authResolved = true;
      })

      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.authResolved = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка проверки при авторизации';
        state.authResolved = true;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })

      .addCase(saveUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(saveUserData.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка обновления данных профиля';
      });
  }
});

export default userSlice.reducer;
