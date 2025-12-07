import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { fetchFeedOrders } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, total, totalToday, isLoading } = useSelector(
    (state) => state.feed
  );

  const handleGetFeeds = () => {
    dispatch(fetchFeedOrders());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
