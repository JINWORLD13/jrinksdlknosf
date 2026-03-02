import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import store from './store/store.jsx';

test('renders App component', async () => {
  await act(async () => {
    render(
      <HelmetProvider>
        <Provider store={store}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>
      </HelmetProvider>
    );
  });

  await waitFor(() => {
    expect(document.body).toBeTruthy();
  });
});
