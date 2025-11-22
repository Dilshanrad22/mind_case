import React from 'react';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme';
import { AppProvider } from './src/store/AppContext';
import store from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </ThemeProvider>
    </Provider>
  );
}
