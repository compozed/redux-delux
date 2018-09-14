import { connect } from 'react-redux'

const rrConnect = (api, mapStateToProps, mapDispatchToProps) => {

    const {request: apiRequests, task: apiTasks} = api;

    const mapStateToPropsWrapper = (state) => {
        const requestStatus = {};
        for (let apiRequest in apiRequests) {
            requestStatus[apiRequest] = apiRequests[apiRequest].status(state);
        }

        const taskStatus = (taskId) => {
            const taskStatus = state['_rr']['_rr_API_TASK'][taskId];
            return taskStatus ? taskStatus : {isInitialized: false};
        };

        const returnObject = {requestStatus, taskStatus};

        if (mapStateToProps instanceof Function){
            return {...returnObject, ...mapStateToProps(state)};
        } else {
            return returnObject;
        }
    };

    const mapDispatchToPropsWrapper = (dispatch) => {
        const request = {};
        for (let apiRequest in apiRequests) {
            request[apiRequest] = (...args) => dispatch(apiRequests[apiRequest].request(...args));
        }

        const task = {};
        for (let apiTask in apiTasks) {
            task[apiTask] = (...args) => dispatch(apiTasks[apiTask](...args));
        }

        const returnObject = {request, task};

        if (mapDispatchToProps instanceof Function){
            return {...returnObject, ...mapDispatchToProps(dispatch)};
        } else {
            return returnObject;
        }
    };

    return connect(mapStateToPropsWrapper, mapDispatchToPropsWrapper);
};

export default rrConnect;
