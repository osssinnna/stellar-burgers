import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (!items.length && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [items.length, isLoading, dispatch]);

  const ingredientData = useMemo(
    () => items.find((item) => item._id === id) || null,
    [items, id]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
