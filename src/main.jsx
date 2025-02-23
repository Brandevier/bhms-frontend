import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Assuming you will create this file for i18n configuration
import './index.css';
import { store } from './redux/store';
import App from './App';
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
    </Provider>
  </StrictMode>
);
