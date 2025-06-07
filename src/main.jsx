import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import { CreatePartner } from './pages/CreatePartner.jsx'

import './index.css'

WebApp.ready();


const router = createBrowserRouter([
  {
    path: "/clickfood/",
    element: <App />,
    children: [
      {
        path: "/clickfood/",
        element: <CreatePartner />,
      },
      // {
      //   path: "/clickfood/my-tours",
      //   element: <OwnerAdvertisementsList />,
      // },
      // {
      //   path: "/clickfood/search",
      //   element: <UserSearchPage />,
      // },
      // {
      //   path: "/clickfood/partner",
      //   element: <PartnerPage />
      // }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
