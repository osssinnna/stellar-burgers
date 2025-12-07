import {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile'
};

const mainIngredient: TIngredient = {
  _id: 'main-id',
  name: 'Начинка',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile'
};

describe('burgerConstructorSlice', () => {
  it('должен добавить булку в конструктор', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    const action = {
      type: addIngredient.type,
      payload: {
        ingredient: bun,
        id: 'ignored-id'
      }
    };

    const newState = burgerConstructorReducer(state, action as any);

    expect(newState.bun).toEqual(bun);
    expect(newState.ingredients).toHaveLength(0);
  });

  it('должен добавить начинку с заданным id', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    const action = {
      type: addIngredient.type,
      payload: {
        ingredient: mainIngredient,
        id: 'test-uuid'
      }
    };

    const newState = burgerConstructorReducer(state, action as any);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mainIngredient,
      id: 'test-uuid'
    });
  });

  it('должен удалить ингредиент по id', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'id-1' },
        { ...mainIngredient, id: 'id-2' }
      ]
    };

    const newState = burgerConstructorReducer(
      startState,
      removeIngredient('id-1')
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].id).toBe('id-2');
  });

  it('должен менять порядок ингредиентов', () => {
    const startState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: 'id-1', name: 'A' },
        { ...mainIngredient, id: 'id-2', name: 'B' }
      ]
    };

    const newState = burgerConstructorReducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(newState.ingredients[0].id).toBe('id-2');
    expect(newState.ingredients[1].id).toBe('id-1');
  });
});
