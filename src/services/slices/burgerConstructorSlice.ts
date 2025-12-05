import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type ConstructorIngredient = TIngredient & {
  id: string;
};

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: ConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

type TMovePayload = {
  fromIndex: number;
  toIndex: number;
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        const newItem: ConstructorIngredient = {
          ...ingredient,
          id: crypto.randomUUID()
        };
        state.ingredients.push(newItem);
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<TMovePayload>) {
      const { fromIndex, toIndex } = action.payload;
      const updated = [...state.ingredients];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      state.ingredients = updated;
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
