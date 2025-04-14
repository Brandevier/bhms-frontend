import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Assuming you will create this file for i18n configuration
import './index.css';
import { store, persistor } from './redux/store';
import App from './App';
import { Toaster } from "react-hot-toast";
import { PersistGate } from 'redux-persist/integration/react'
// import NotificationSound from './util/Notification';





const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          {/* <NotificationSound />   */}
          <Toaster />
        </PersistGate>
      </I18nextProvider>
    </Provider>
  </StrictMode>
);
