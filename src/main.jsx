import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './index.css';
import { store, persistor } from './redux/store';
import App from './App';
import { Toaster } from "react-hot-toast";
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './components/LoadingScreen'; // Import the loading component

const RootComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PersistGate loading={null} persistor={persistor}>
            {loading ? (
              <LoadingScreen />
            ) : (
              <>
                <App />
                <Toaster />
              </>
            )}
          </PersistGate>
        </I18nextProvider>
      </Provider>
    </StrictMode>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<RootComponent />);