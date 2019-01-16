const apiTaskReducer = (state = {}, action) => {
    if(action.type!=='_rr_API_TASK')
        return state;

    switch (action.state) {
        case 'LOADING':
            return {...state, [action.id]: {isInitialized: true, isLoading: true, error: '', success: false}};
        case 'SUCCESS':
            return {...state, [action.id]: {isInitialized: true, isLoading: false, error: '', success: true, data: action.data}};
        case 'ERROR':
            return {...state, [action.id]: {isInitialized: true, isLoading: false, error: action.error, success: false}};
        default:
            throw Error('Unknown state passed to _rr_API_TASK reducer')
    }
};

export default apiTaskReducer;
