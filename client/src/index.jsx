import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import ErrorPage from './routes/ErrorPage';
import CreateContainer from './routes/CreateContainer'
import Panel from './routes/Panel';
import Support from './routes/Support';
import AccountSettings from './routes/AccountSettings';

import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Panel/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/create-container",
    element: <CreateContainer/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/support",
    element: <Support/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/account",
    element: <AccountSettings/>,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
