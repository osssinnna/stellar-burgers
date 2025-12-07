import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import type { AppThunk } from '../store';
import { clearConstructor } from './burgerConstructorSlice';

type OrderState = {
  orderRequest: boolean;
  orderError: string | null;
  orderModalData: TOrder | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderError: null,
  orderModalData: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderRequestStart(state) {
      state.orderRequest = true;
      state.orderError = null;
    },
    orderRequestSuccess(state, action: PayloadAction<TOrder>) {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    },
    orderRequestFailed(state, action: PayloadAction<string>) {
      state.orderRequest = false;
      state.orderError = action.payload;
    },
    closeOrderModal(state) {
      state.orderModalData = null;
    }
  }
});

export const {
  orderRequestStart,
  orderRequestSuccess,
  orderRequestFailed,
  closeOrderModal
} = orderSlice.actions;

export const createOrder = (): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(orderRequestStart());

    const { bun, ingredients } = getState().burgerConstructor;

    if (!bun) {
      throw new Error('Булка не выбрана');
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const data = await orderBurgerApi(ingredientsIds);

    dispatch(orderRequestSuccess(data.order));
    dispatch(clearConstructor());
  } catch (e) {
    dispatch(orderRequestFailed('Ошибка при оформлении заказа'));
  }
};

export const orderReducer = orderSlice.reducer;
