import { SET_ALERT, REMOVE_ALERT } from '../actions/types' //Better practice to use/import variables

const initialState = [];

export default function(state = initialState, action) {
    const { type, payload } = action

    switch(type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload) /// The payload will be an id
        default:
            return state;
    }
}