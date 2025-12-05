import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import type { AppThunk } from '../store';

type OrderDetailsState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderDetailsState = {
  order: null,
  isLoading: false,
  error: null
};

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    orderDetailsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    orderDetailsSuccess(state, action: PayloadAction<TOrder>) {
      state.isLoading = false;
      state.order = action.payload;
    },
    orderDetailsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
      state.order = null;
    }
  }
});

export const { orderDetailsRequest, orderDetailsSuccess, orderDetailsFailed } =
  orderDetailsSlice.actions;

export const fetchOrderByNumber =
  (number: number): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(orderDetailsRequest());
      const data = await getOrderByNumberApi(number);
      const order = data.orders[0];
      if (!order) {
        throw new Error('Заказ не найден');
      }
      dispatch(orderDetailsSuccess(order));
    } catch (e) {
      dispatch(orderDetailsFailed('Ошибка загрузки заказа'));
    }
  };

export const orderDetailsReducer = orderDetailsSlice.reducer;
