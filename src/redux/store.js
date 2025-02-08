import { configureStore } from "@reduxjs/toolkit";
import  * as reducers from  './reducers/index'


export const store = configureStore({
  reducer: {
    waitlist: reducers.authReducer,
    auth:reducers.waitListReducers  
  },
});
 
export default store;
 