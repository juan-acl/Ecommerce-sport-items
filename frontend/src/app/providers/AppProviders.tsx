import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from '../store';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <Provider store={store}>
      {children}
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
