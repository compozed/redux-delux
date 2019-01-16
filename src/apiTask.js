import {v1 as uuid} from 'uuid';

const apiTask = (taskBuilder, optionalGetDataReturn) => {

    const type = '_rr_API_TASK';

    return (...args) => {
        return dispatch => {
            const id = uuid();
            dispatch({type, id, state: 'LOADING'});
            try{
                const tasks = taskBuilder(...args, dispatch);

                (async ()=>{
                    try {
                        let data = [];
                        for (const task of tasks) {
                            const res = await task(data);
                            data.push(res);
                        }
                        if(optionalGetDataReturn) {
                            // only return the data if the user passed a function to determine what data to return
                            dispatch({type, id, state: 'SUCCESS', data: optionalGetDataReturn(data)})
                        } else {
                            dispatch({type, id, state: 'SUCCESS'})
                        }
                    } catch (error){
                        dispatch({type, id, state: 'ERROR', error: error.toString()})
                    }
                })()

            } catch(error){
                dispatch({type, id, state: 'ERROR', error: error.toString()})
            }
            return id
        }
    }
};

export default apiTask;
