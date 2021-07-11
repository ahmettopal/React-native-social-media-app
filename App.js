import React from 'react';
import AppRouter from "./src/appRouter"
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import _store from "./src/store/store";
import LoadingScreen from './src/containers/main/auth/LoadingScreen'

const App = () => {
  const { store, persistor } = _store()
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AppRouter />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;