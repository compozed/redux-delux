import {combineReducers as reduxCombineReducers} from 'redux';
import apiRequestReducer from "./apiRequestReducer";
import apiTaskReducer from "./apiTaskReducer";

const combineReducers = (userReducers = {}) => {
    if (userReducers._rr) {
        throw new Error('Cannot use _rr namespace in reducers with redux-delux')
    }

    return reduxCombineReducers(
        {
            _rr: reduxCombineReducers({
                _rr_API_REQUEST: apiRequestReducer,
                _rr_API_TASK: apiTaskReducer,
            }),
            ...userReducers
        })
};

export const reducers = combineReducers({});

export default combineReducers;
