import { Provider } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router';
import { Layout } from './components/Layout';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderPage } from './pages/OrderPage';
import type { AppStore } from './store';

// HashRouter: o GitHub Pages só serve arquivos estáticos, então rotas como
// /checkout não existem no servidor. Com hash (#/checkout) o recarregamento funciona.
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'pedido/:orderId', element: <OrderPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function App({ store }: { store: AppStore }) {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
