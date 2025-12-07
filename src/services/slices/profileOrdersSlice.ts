import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';
import type { AppThunk } from '../store';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    profileOrdersSuccess(state, action: PayloadAction<TOrder[]>) {
      state.isLoading = false;
      state.orders = action.payload;
    },
    profileOrdersFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  profileOrdersRequest,
  profileOrdersSuccess,
  profileOrdersFailed
} = profileOrdersSlice.actions;

export const fetchUserOrders = (): AppThunk => async (dispatch) => {
  try {
    dispatch(profileOrdersRequest());
    const orders = await getOrdersApi();
    dispatch(profileOrdersSuccess(orders));
  } catch (e) {
    console.error('Ошибка загрузки заказов пользователя', e);
    dispatch(profileOrdersFailed('Ошибка загрузки заказов пользователя'));
  }
};

export const profileOrdersReducer = profileOrdersSlice.reducer;
