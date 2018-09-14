const apiRequestReducer = (state = {}, action) => {
    if(action.type !== '_rr_API_REQUEST')
        return state;

    switch (action.state) {
        case 'LOADING':
            return {...state, [action.id]: {...state[action.id], isInitialized: true, isLoading: true, error: ''}};
        case 'SUCCESS':
            return {...state, [action.id]: {isInitialized: true, isLoading: false, error: '', data: action.data}};
        case 'ERROR':
            return {...state, [action.id]: {...state[action.id], isInitialized: true, isLoading: false, error: action.error}};
        case 'PATCH':
            const updatedData = action.dataTransformationFunction(state[action.id].data);
            return {...state, [action.id]: {...state[action.id], data: updatedData}};
        default:
            throw Error('Unknown state passed to _rr_API_REQUEST reducer')
    }

};

export default apiRequestReducer;
