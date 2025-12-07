import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import type { AppThunk } from '../store';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    feedRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    feedSuccess(
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    feedFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { feedRequest, feedSuccess, feedFailed } = feedSlice.actions;

export const fetchFeedOrders = (): AppThunk => async (dispatch) => {
  try {
    dispatch(feedRequest());

    const data = await getFeedsApi();

    dispatch(
      feedSuccess({
        orders: data.orders,
        total: data.total,
        totalToday: data.totalToday
      })
    );
  } catch (e) {
    console.error('Ошибка загрузки ленты заказов', e);
    dispatch(feedFailed('Ошибка загрузки ленты заказов'));
  }
};

export const feedReducer = feedSlice.reducer;
