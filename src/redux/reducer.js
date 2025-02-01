const initialState = {
  waitlist: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_WAITLIST':
      return {
        ...state,
        waitlist: [...state.waitlist, action.payload],
      };
    default:
      return state;
  }
};

export default rootReducer;
