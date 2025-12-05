import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />

        <Route
          path='/feed/:number'
          element={
            <Modal title='Информация о заказе' onClose={handleCloseModal}>
              <OrderInfo />
            </Modal>
          }
        />

        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={handleCloseModal}>
              <IngredientDetails />
            </Modal>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute
              component={
                <Modal title='Информация о заказе' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              }
            />
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
