import { Suspense, lazy } from 'react'
import '../styles/Main.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ProtectedRoute from '../auth/AuthGuard'
import Loader from '../components/loader'
const Layout = lazy(() => import('../components/Layout'))

const Home = lazy(() => import('../pages/Home'))
const Blog = lazy(() => import('../pages/Blog'))
const Login = lazy(() => import('../pages/Login'))


const Accounts = lazy(() => import('../pages/Masters/Accounts'));
const AccountType = lazy(() => import('../pages/Masters/AccountType'));
const AccountCategory = lazy(() => import('../pages/Masters/AccountCategory'));
// const Division = lazy(() => import('../pages/Masters/Division'));


const State = lazy(() => import('../pages/Masters/State'));
const Company = lazy(() => import('../pages/Masters/Company'));
const Material = lazy(() => import('../pages/Masters/Material'));
const Plant = lazy(() => import('../pages/Masters/Plant'));
const StorageLocation = lazy(() => import('../pages/Masters/StorageLocation'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // ⬅️ Common layout with Navbar/Header
    errorElement: <div>404! Page not found</div>,
    children: [
      { path: '/login', element: <Login /> },
      { index: "/", element: <ProtectedRoute><Blog /></ProtectedRoute> },
      // { path: '/home', element: <Home /> },
      { path: '/account', children: [
        { index: true, element: <Navigate to="type" replace /> },
        { path: 'type', element: <ProtectedRoute><AccountType /></ProtectedRoute> },
        { path: 'category', element: <ProtectedRoute><AccountCategory /></ProtectedRoute> },
        // { path: 'division', element: <ProtectedRoute><Division /></ProtectedRoute> },
      ]},
      { path: "/admin", children: [
        { index: true, element: <Navigate to="state" replace /> },
        { path: "state", element: <ProtectedRoute> <State /> </ProtectedRoute> },
        { path: "company", element: <ProtectedRoute> <Company /> </ProtectedRoute> },
        { path: "storage-location", element: <ProtectedRoute> <StorageLocation /> </ProtectedRoute> },

      ]},
    ]
  },
]);

const protectedRoutes = [""];
router.routes.forEach(route => {
  if (protectedRoutes.includes(route.path)) {
    route.element = <ProtectedRoute element={route.element} />;
  }
});

const Router = () => {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}


export default Router
