import {API_ACTIONS} from '../../actionTypes';

const initialState = {
  activePlace: null,
};

export const cardList = (state = initialState, action) => {
  switch (action.type) {
    case API_ACTIONS.SELECT_PLACE:
      return {
        ...state,
        activePlace: action.payload.place
      };
    default:
      return state;
  }
};
