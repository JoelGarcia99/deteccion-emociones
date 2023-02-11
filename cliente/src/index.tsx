import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './presentacion/routes/routes';

import "./index.css";

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RouterProvider router={router} />
);

