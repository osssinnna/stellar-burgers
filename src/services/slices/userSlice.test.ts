import { TUser } from '@utils-types';
import {
  userReducer,
  authRequest,
  authSuccess,
  authFailed,
  setUser,
  setAuthChecked
} from './userSlice';

describe('userSlice reducer', () => {
  const getInitialState = () =>
    userReducer(undefined, { type: 'UNKNOWN_ACTION' });

  it('должен устанавливать isLoading=true и очищать error при authRequest', () => {
    const initialState = {
      ...getInitialState(),
      error: 'Старая ошибка'
    };

    const state = userReducer(initialState, authRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять пользователя и устанавливать isLoading=false при authSuccess', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const user: TUser = {
      email: 'test@example.com',
      name: 'Тестовый пользователь'
    } as TUser;

    const state = userReducer(initialState, authSuccess(user));

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.user).toEqual(user);
  });

  it('должен сохранять ошибку и устанавливать isLoading=false при authFailed', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const state = userReducer(initialState, authFailed('Ошибка авторизации'));

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка авторизации');
  });

  it('должен изменять пользователя при setUser', () => {
    const initialState = getInitialState();

    const user: TUser = {
      email: 'user@example.com',
      name: 'User'
    } as TUser;

    const state = userReducer(initialState, setUser(user));

    expect(state.user).toEqual(user);
  });

  it('должен изменять флаг isAuthChecked при setAuthChecked', () => {
    const initialState = getInitialState();

    const state = userReducer(initialState, setAuthChecked(true));

    expect(state.isAuthChecked).toBe(true);
  });
});
