import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при неизвестном экшене', () => {
    const store = configureStore({ reducer: rootReducer });
    const initialState = store.getState();
    const stateFromReducer = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(stateFromReducer).toEqual(initialState);
  });
});
