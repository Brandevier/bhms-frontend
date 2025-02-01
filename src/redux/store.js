import { createStore } from 'redux';
import rootReducer from './reducer'; // Import the root reducer

const store = createStore(rootReducer);

export default store;
