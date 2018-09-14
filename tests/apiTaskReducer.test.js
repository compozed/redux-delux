import apiTaskReducer from "../src/apiTaskReducer";

describe('API Task Reducer', () => {

    it('returns the original state object if the action type is not equal to _rr_API_TASK', ()=>{
        let action = {type: 'random action type'};
        let state = {};

        expect(apiTaskReducer(state, action)).toBe(state);
    });

    it('throw an error if the action state is not in the switch', ()=>{
        let action = {type: '_rr_API_TASK', state: 'random action state'};
        let state = {};

        expect(()=>apiTaskReducer(state, action)).toThrow();
    });

    it('should return state correctly for LOADING action state', ()=>{
        let action = {type: '_rr_API_TASK', state: 'LOADING', id:'test'};
        let state = {};
        const expected = {[action.id]: {isInitialized: true, isLoading: true, error: '', success: false}}

        expect(apiTaskReducer(state, action)).toEqual(expected);
    });

    it('should return state correctly for SUCCESS action state', ()=>{
        let action = {type: '_rr_API_TASK', state: 'SUCCESS', id:'test'};
        let state = {};
        const expected = {[action.id]: {isInitialized: true, isLoading: false, error: '', success: true}}

        expect(apiTaskReducer(state, action)).toEqual(expected);
    });

    it('should return state correctly for ERROR action state', ()=>{
        let action = {type: '_rr_API_TASK', state: 'ERROR', id:'test', error: 'test error message'};
        let state = {};
        const expected = {[action.id]: {isInitialized: true, isLoading: false, error: action.error, success: false}}

        expect(apiTaskReducer(state, action)).toEqual(expected);
    });

});
