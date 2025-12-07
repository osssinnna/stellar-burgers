import { TOrder } from '@utils-types';
import {
  orderDetailsReducer,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFailed
} from './orderDetailsSlice';

describe('orderDetailsSlice reducer', () => {
  const getInitialState = () =>
    orderDetailsReducer(undefined, { type: 'UNKNOWN_ACTION' });

  it('должен устанавливать isLoading=true и очищать error при orderDetailsRequest', () => {
    const initialState = getInitialState();

    const state = orderDetailsReducer(initialState, orderDetailsRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.order).toBeNull();
  });

  it('должен сохранять заказ при orderDetailsSuccess', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const order: TOrder = {
      _id: '1',
      number: 333,
      name: 'Детали заказа',
      status: 'done',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: ['ing-1', 'ing-2']
    } as TOrder;

    const state = orderDetailsReducer(initialState, orderDetailsSuccess(order));

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(order);
  });

  it('должен устанавливать error, очищать order и isLoading=false при orderDetailsFailed', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const state = orderDetailsReducer(
      initialState,
      orderDetailsFailed('Ошибка загрузки заказа')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказа');
    expect(state.order).toBeNull();
  });
});
