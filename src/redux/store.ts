import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import galleryReducer from './gallery/gallery.reducer'

const rootReducer = combineReducers({ gallery: galleryReducer })

export type Store = ReturnType<typeof rootReducer>

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middlewares = [thunk]

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))

export default store
