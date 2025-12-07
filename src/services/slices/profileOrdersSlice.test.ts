import { TOrder } from '@utils-types';
import {
  profileOrdersReducer,
  profileOrdersRequest,
  profileOrdersSuccess,
  profileOrdersFailed
} from './profileOrdersSlice';

describe('profileOrdersSlice reducer', () => {
  const getInitialState = () =>
    profileOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' });

  it('должен устанавливать isLoading=true и очищать error при profileOrdersRequest', () => {
    const initialState = getInitialState();

    const state = profileOrdersReducer(initialState, profileOrdersRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказы пользователя при profileOrdersSuccess', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const orders: TOrder[] = [
      {
        _id: '1',
        number: 222,
        name: 'Заказ пользователя',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: ['ing-1']
      } as TOrder
    ];

    const state = profileOrdersReducer(
      initialState,
      profileOrdersSuccess(orders)
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(orders);
  });

  it('должен устанавливать error и isLoading=false при profileOrdersFailed', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const state = profileOrdersReducer(
      initialState,
      profileOrdersFailed('Ошибка загрузки заказов пользователя')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов пользователя');
  });
});
