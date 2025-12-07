import { TOrder } from '@utils-types';
import {
  orderReducer,
  orderRequestStart,
  orderRequestSuccess,
  orderRequestFailed,
  closeOrderModal
} from './orderSlice';

describe('orderSlice reducer', () => {
  const getInitialState = () =>
    orderReducer(undefined, { type: 'UNKNOWN_ACTION' });

  it('должен устанавливать orderRequest=true и очищать orderError при orderRequestStart', () => {
    const initialState = {
      ...getInitialState(),
      orderError: 'Старая ошибка'
    };

    const state = orderReducer(initialState, orderRequestStart());

    expect(state.orderRequest).toBe(true);
    expect(state.orderError).toBeNull();
  });

  it('должен сохранять данные заказа и устанавливать orderRequest=false при orderRequestSuccess', () => {
    const initialState = {
      ...getInitialState(),
      orderRequest: true
    };

    const order: TOrder = {
      _id: '1',
      number: 444,
      name: 'Новый заказ',
      status: 'done',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: ['ing-1', 'ing-2']
    } as TOrder;

    const state = orderReducer(initialState, orderRequestSuccess(order));

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
  });

  it('должен сохранять ошибку и устанавливать orderRequest=false при orderRequestFailed', () => {
    const initialState = {
      ...getInitialState(),
      orderRequest: true
    };

    const state = orderReducer(
      initialState,
      orderRequestFailed('Ошибка при оформлении заказа')
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderError).toBe('Ошибка при оформлении заказа');
  });

  it('должен очищать orderModalData при closeOrderModal', () => {
    const initialState = {
      ...getInitialState(),
      orderModalData: {
        _id: '1',
        number: 555,
        name: 'Заказ',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: ['ing-1']
      } as TOrder
    };

    const state = orderReducer(initialState, closeOrderModal());

    expect(state.orderModalData).toBeNull();
  });
});
