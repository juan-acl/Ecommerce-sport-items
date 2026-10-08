import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { store } from '../store';
import { router } from '../router';

export function AppProviders() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: 'Manrope, sans-serif',
          },
        }}
      />
    </Provider>
  );
}
