import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from "../reducers";


const middleware = [thunk];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
  const persistor = persistStore(store);
  return { store, persistor };
}

/*
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);*/

//export default store;