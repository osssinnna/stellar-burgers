import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { deleteCookie, setCookie } from '../../utils/cookie';
import type { AppThunk } from '../store';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<TUser>) {
      state.isLoading = false;
      state.user = action.payload;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  }
});

export const { authRequest, authSuccess, authFailed, setUser, setAuthChecked } =
  userSlice.actions;

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const registerUser =
  (form: TRegisterData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authRequest());
      const data = await registerUserApi(form);
      saveTokens(data.accessToken, data.refreshToken);
      dispatch(authSuccess(data.user));
      dispatch(setAuthChecked(true));
    } catch {
      dispatch(authFailed('Ошибка регистрации'));
      dispatch(setAuthChecked(true));
    }
  };

export const loginUser =
  (form: TLoginData): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authRequest());
      const data = await loginUserApi(form);
      saveTokens(data.accessToken, data.refreshToken);
      dispatch(authSuccess(data.user));
      dispatch(setAuthChecked(true));
    } catch {
      dispatch(authFailed('Ошибка авторизации'));
      dispatch(setAuthChecked(true));
    }
  };

export const getUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(authRequest());
    const data = await getUserApi();
    dispatch(authSuccess(data.user));
  } catch {
    dispatch(setUser(null));
  } finally {
    dispatch(setAuthChecked(true));
  }
};

export const updateUser =
  (user: Partial<TRegisterData>): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authRequest());
      const data = await updateUserApi(user);
      dispatch(authSuccess(data.user));
    } catch {
      dispatch(authFailed('Ошибка обновления профиля'));
    }
  };

export const logoutUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(authRequest());
    await logoutApi();
  } catch {
  } finally {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setUser(null));
    dispatch(setAuthChecked(true));
  }
};

export const checkUserAuth = (): AppThunk => async (dispatch) => {
  const hasRefreshToken = !!localStorage.getItem('refreshToken');

  if (!hasRefreshToken) {
    dispatch(setAuthChecked(true));
    return;
  }

  dispatch(getUser());
};

export const userReducer = userSlice.reducer;
