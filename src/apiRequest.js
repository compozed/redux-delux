import axios from 'axios';

const apiRequest = (urlBuilder) => {

    const type = '_rr_API_REQUEST';

    const getFullUrl = (...args) => {
        // call URL builder if it is a function, otherwise assume it is a string
        return (urlBuilder instanceof Function) ? urlBuilder(...args) : urlBuilder;
    };

    return {
        request: (...args) => {
            return async (dispatch) => {
                const fullURL = getFullUrl(...args);
                dispatch({type, state: 'LOADING', id: fullURL});
                try {
                    const res = await axios.get(fullURL);
                    const data = res.data;
                    dispatch({type, state: 'SUCCESS', id: fullURL, data});
                } catch (e) {
                    const error = e.toString();
                    dispatch({type, state: 'ERROR', id: fullURL, error});
                    // API task uses this exception to report a failure, if this request is used within a task
                    throw e;
                }
            };
        },
        status: (state) => {
            return (...args) => {
                const fullURL = getFullUrl(...args);
                return state['_rr'][type][fullURL] ? state['_rr'][type][fullURL] : {isInitialized: false, isLoading: false, error: '', data: undefined};
            };
        },
        patch: (...args) => {
            const dataTransformationFunction = args.pop();
            const dispatch = args.pop();

            dispatch({type, state: 'PATCH', id: getFullUrl(...args), dataTransformationFunction})
        }
    };
};

export default apiRequest;
