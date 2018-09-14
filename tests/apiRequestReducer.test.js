import apiRequestReducer from "../src/apiRequestReducer";

describe('API Request Reducer', () => {

    const data = {};

    it('returns the original state object if the action type is not equal to _rr_API_REQUEST', ()=>{
        let action = {type: 'random action type'};
        let state = {};

        expect(apiRequestReducer(state, action)).toBe(state);
    });

    it('throw an error if the action state is not in the switch', ()=>{
        let action = {type: '_rr_API_REQUEST', state: 'random action state'};
        let state = {};

        expect(()=>apiRequestReducer(state, action)).toThrow();
    });

    it('should return state correctly for LOADING action state', ()=>{
        let action = {type: '_rr_API_REQUEST', state: 'LOADING', id:'test'};
        let state = {[action.id]: {data}};
        const expected = {[action.id]: {isInitialized: true, isLoading: true, error: '', data}};

        expect(apiRequestReducer(state, action)).toEqual(expected);
    });

    it('should return state correctly for SUCCESS action state', ()=>{
        let action = {type: '_rr_API_REQUEST', state: 'SUCCESS', id:'test', data};
        let state = {};
        const expected = {[action.id]: {isInitialized: true, isLoading: false, error: '', data}}

        expect(apiRequestReducer(state, action)).toEqual(expected);
    });

    it('should return state correctly for ERROR action state', ()=>{
        let action = {type: '_rr_API_REQUEST', state: 'ERROR', id:'test', error: 'test error message'};
        let state = {[action.id]: {data}};
        const expected = {[action.id]: {isInitialized: true, isLoading: false, error: action.error, data}}

        expect(apiRequestReducer(state, action)).toEqual(expected);
    });

    it('should return state correctly for PATCH action state', ()=>{

        const dataTransformationFunction = (localData) => localData * 2;

        let action = {type: '_rr_API_REQUEST', state: 'PATCH', id:'test', dataTransformationFunction};
        let data = 10;
        let state = {[action.id]: {isInitialized: true, isLoading: false, error: '', data}};
        const expected = {[action.id]: {isInitialized: true, isLoading: false, error: '', data: data*2}};

        expect(apiRequestReducer(state, action)).toEqual(expected);
    });

    it('should throw an error if action does not have an id', () => {
        expect(()=>apiRequestReducer(state, {type: '_rr_API_REQUEST', state: 'LOADING'})).toThrow();
    });



});
