import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import type { AppDispatch, AppThunk } from '../store';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    getIngredientsRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    getIngredientsSuccess(state, action: PayloadAction<TIngredient[]>) {
      state.isLoading = false;
      state.items = action.payload;
    },
    getIngredientsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed
} = ingredientsSlice.actions;

export const fetchIngredients = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getIngredientsRequest());
    const data = await getIngredientsApi();
    dispatch(getIngredientsSuccess(data));
  } catch (e) {
    dispatch(getIngredientsFailed('Ошибка загрузки ингредиентов'));
  }
};

export const ingredientsReducer = ingredientsSlice.reducer;
