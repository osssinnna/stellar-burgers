import { TOrder } from '@utils-types';
import { feedReducer, feedRequest, feedSuccess, feedFailed } from './feedSlice';

describe('feedSlice reducer', () => {
  const getInitialState = () =>
    feedReducer(undefined, { type: 'UNKNOWN_ACTION' });

  it('должен устанавливать isLoading=true и очищать error при feedRequest', () => {
    const initialState = getInitialState();

    const state = feedReducer(initialState, feedRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказы и total/totalToday при feedSuccess', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const orders: TOrder[] = [
      {
        _id: '1',
        number: 111,
        name: 'Тестовый заказ',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: ['ing-1', 'ing-2']
      } as TOrder
    ];

    const state = feedReducer(
      initialState,
      feedSuccess({
        orders,
        total: 10,
        totalToday: 3
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(3);
  });

  it('должен устанавливать error и isLoading=false при feedFailed', () => {
    const initialState = {
      ...getInitialState(),
      isLoading: true
    };

    const state = feedReducer(
      initialState,
      feedFailed('Ошибка загрузки ленты')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });
});
