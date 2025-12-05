import { FC } from 'react';
import styles from './ingredient-page.module.css';
import { IngredientDetails } from '../../components';

export const IngredientPage: FC = () => (
  <main className={styles.page}>
    <IngredientDetails />
  </main>
);
