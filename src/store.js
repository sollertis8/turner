import {createStore, applyMiddleware, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import thunk from 'redux-thunk';

const store = createStore(combineReducers({form: formReducer}), applyMiddleware(thunk));

// Hydrate the authToken from localStorage if it exists

export default store;