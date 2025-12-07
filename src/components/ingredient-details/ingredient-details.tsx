import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { items, isLoading } = useSelector((state) => state.ingredients);

  const ingredientData = useMemo(
    () => items.find((item) => item._id === id) || null,
    [items, id]
  );

  if (isLoading || !items.length || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
