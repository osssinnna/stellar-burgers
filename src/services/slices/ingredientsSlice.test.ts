import {
  ingredientsReducer,
  getIngredientsRequest,
  getIngredientsSuccess,
  getIngredientsFailed
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'id-1',
  name: 'Ингредиент',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 10,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile'
};

describe('ingredientsSlice', () => {
  it('getIngredientsRequest: isLoading = true, error = null', () => {
    const state = ingredientsReducer(undefined, getIngredientsRequest());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getIngredientsSuccess: данные записываются и isLoading = false', () => {
    const loadingState = {
      ...ingredientsReducer(undefined, { type: 'UNKNOWN' }),
      isLoading: true
    };

    const state = ingredientsReducer(
      loadingState,
      getIngredientsSuccess([ingredient])
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual([ingredient]);
  });

  it('getIngredientsFailed: error записывается и isLoading = false', () => {
    const loadingState = {
      ...ingredientsReducer(undefined, { type: 'UNKNOWN' }),
      isLoading: true
    };

    const state = ingredientsReducer(
      loadingState,
      getIngredientsFailed('Ошибка загрузки')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
