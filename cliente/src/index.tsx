import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './presentacion/routes/routes';
import { Provider, useDispatch, useSelector } from 'react-redux';

import "./index.css";
import store, { AppDispatch, RootState } from './presentacion/redux/store';
import { AuthState } from './presentacion/redux/reducers/auth.reducer';
import { useEffect, useState } from 'react';
import AppActions from './presentacion/redux/actions';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // buscando si el usuario tiene un token guardado en el local storage
    const storageToken = localStorage.getItem('de-token');
    const storageUser = localStorage.getItem('de-user');

    if (storageToken && storageUser) {
      dispatch({
        type: AppActions.LOGIN,
        payload: {
          accessToken: storageToken,
          user: JSON.parse(storageUser),
        },
      });
    }

    // this is just to don't redirect the user to the home page if he 
    // has an active session
    setTimeout(() => {
      setLoaded(true);
    }, 300)
  }, []);

  const auth = useSelector((state: RootState) => state.auth) as AuthState;
  const isAuthenticated = !loaded ? null : (!!auth.accessToken && !!auth.user);
  return <RouterProvider router={router(isAuthenticated)} />
}

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

