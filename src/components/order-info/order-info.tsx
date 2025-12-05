import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderDetailsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderNumber = Number(number);

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const orderFromDetails = useSelector((state) => state.orderDetails.order);

  const ingredients = useSelector(
    (state) => state.ingredients.items
  ) as TIngredient[];
  const ingredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );

  useEffect(() => {
    if (!orderNumber) return;

    const hasOrderInFeed = feedOrders.some(
      (order) => order.number === orderNumber
    );
    const hasOrderInProfile = profileOrders.some(
      (order) => order.number === orderNumber
    );

    if (!hasOrderInFeed && !hasOrderInProfile && !orderFromDetails) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, feedOrders, profileOrders, orderFromDetails, orderNumber]);

  const orderData =
    feedOrders.find((order) => order.number === orderNumber) ||
    profileOrders.find((order) => order.number === orderNumber) ||
    orderFromDetails ||
    null;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!itemId) return acc;
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (ingredientsLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
