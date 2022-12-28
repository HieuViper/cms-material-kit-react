import { SET_EMAIL_INPUT, SET_PASSWORD_INPUT } from './constants';

const initState = {
  email: '',
  password: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_EMAIL_INPUT:
      return {
        ...state,
        email: action.payload,
      };

    case SET_PASSWORD_INPUT:
      return {
        ...state,
        password: action.payload,
      };

    default:
      throw new Error();
  }
};

export { initState };
export default reducer;
