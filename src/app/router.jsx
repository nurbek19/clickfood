import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import App from './App.jsx';

const CreatePartner = lazy(() => import('@partner/pages/CreatePartner.jsx'));
const CreateMenu = lazy(() => import('@menu/pages/CreateMenu.jsx'));
const OrderPage = lazy(() => import('@order/pages/OrderPage.jsx'));

const withSuspense = (element) => (
  <Suspense fallback={<div className="loading">Загрузка...</div>}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/clickfood/',
    element: <App />,
    children: [
      {
        path: '/clickfood/',
        element: withSuspense(<CreatePartner />),
      },
      {
        path: '/clickfood/foods',
        element: withSuspense(<CreateMenu />),
      },
      {
        path: '/clickfood/order',
        element: withSuspense(<OrderPage />),
      },
    ],
  },
]);

export default router;


