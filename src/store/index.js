import { createStore } from "redux";
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers';
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2 ,
    blacklist: ['groupMessage']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export let persistor = persistStore(store);
