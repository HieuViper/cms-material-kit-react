import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Auth from './utils/Auth';
import BlogPageTest from './pages/BlogPageTest';
import ProductsPageTest from './pages/ProductPageTest';
import EditProductPage from './pages/EditProductPage';
// import { authContext } from './utils/useAuth';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <Auth>
          <DashboardLayout />
        </Auth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element: (
            <Auth>
              <DashboardAppPage />
            </Auth>
          ),
        },
        {
          path: 'user',
          element: <UserPage />,
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products-test', element: <ProductsPageTest /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog-test', element: <BlogPageTest /> },
        { path: 'edit-product/:id', element: <EditProductPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: (
        <Auth>
          <SimpleLayout />
        </Auth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
