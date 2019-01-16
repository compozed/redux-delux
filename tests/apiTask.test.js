import {apiTask} from '../src';
import sinon from 'sinon';

describe('apiTask', () => {

    it('should dispatch updates to the store', (done) => {
        const testSubTask = () => {};
        const builder = () => [testSubTask, testSubTask, testSubTask];
        const expectedDispatchCallQuantity = 2;
        const argument = 5;
        const dispatch = sinon.spy();
        apiTask(builder)(argument)(dispatch);


        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);

    });

    it('should dispatch the loading action and return the associated ID', () => {
        const testSubTask = () => {};
        const builder = () => [testSubTask, testSubTask, testSubTask];
        const argument = 5;
        const dispatch = sinon.spy();
        const id = apiTask(builder)(argument)(dispatch);

        expect(dispatch.firstCall.args[0].state).toBe('LOADING');
        expect(dispatch.firstCall.args[0].type).toBe('_rr_API_TASK');
        expect(dispatch.firstCall.args[0].id).toBe(id);
    });

    it('should dispatch the success action after running all subtasks', (done) => {
        const testSubTask = sinon.spy();
        const builder = () => [testSubTask, testSubTask, testSubTask];
        const expectedDispatchCallQuantity = 2;
        const argument = 5;
        const dispatch = sinon.spy();
        const id = apiTask(builder)(argument)(dispatch);


        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                expect(testSubTask.calledThrice).toBe(true);
                expect(dispatch.secondCall.args[0].state).toBe('SUCCESS');
                expect(dispatch.secondCall.args[0].type).toBe('_rr_API_TASK');
                expect(dispatch.secondCall.args[0].data).toBe(undefined);
                expect(dispatch.secondCall.args[0].id).toBe(id);
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);
    });

    it('should send the response back if function provided', (done) => {
        const testSubTask = () => {
            return "foobar";
        };
        const builder = () => [testSubTask];
        const argument = 5;
        const expectedDispatchCallQuantity = 2;
        const dispatch = sinon.spy();
        const func = (data) => {
            // the input `data` is an array of the result of each sub-task
            // this function can be used to only store a subset of the response data
            // this is helpful to save memory if you are using many tasks and want to conserve memory
            return data[0].toUpperCase();
        };
        const id = apiTask(builder, func)(argument)(dispatch);

        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                expect(dispatch.secondCall.args[0].state).toBe('SUCCESS');
                expect(dispatch.secondCall.args[0].type).toBe('_rr_API_TASK');
                expect(dispatch.secondCall.args[0].data).toEqual('FOOBAR');
                expect(dispatch.secondCall.args[0].id).toBe(id);
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);

    });

    it('should run all subtasks and pass an array to each subtask containing the results of all previous subtasks', (done) => {
        const testSubTask = sinon.spy((arg) => arg.length);
        const builder = () => [testSubTask, testSubTask, testSubTask];
        const expectedDispatchCallQuantity = 2;
        const argument = 5;
        const dispatch = sinon.spy();
        apiTask(builder)(argument)(dispatch);

        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                // by the time this executes, the results of the third call have been appended to the array
                // testSubTask is executed three times because the builder returns it in the array three times
                expect(testSubTask.thirdCall.args[0]).toEqual([0, 1, 2]);
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);
    });

    it('should dispatch the error action if one of the subtasks throws an error', (done) => {
        const testSubTask = sinon.spy(() => {
            throw new Error('Failed subtask');
        });
        const builder = () => [testSubTask, testSubTask, testSubTask];
        const expectedDispatchCallQuantity = 2;
        const argument = 5;
        const dispatch = sinon.spy();
        const id = apiTask(builder)(argument)(dispatch);

        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                expect(dispatch.secondCall.args[0].state).toBe('ERROR');
                expect(dispatch.secondCall.args[0].type).toBe('_rr_API_TASK');
                expect(dispatch.secondCall.args[0].error).toBe('Error: Failed subtask');
                expect(dispatch.secondCall.args[0].id).toBe(id);
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);
    });

    it('should dispatch the error action if the task builder throws an error', (done) => {
        const builder = () => {
            throw new Error('Failed subtask');
        };
        const expectedDispatchCallQuantity = 2;
        const argument = 5;
        const dispatch = sinon.spy();
        const id = apiTask(builder)(argument)(dispatch);

        const checkIfTestIsComplete = () => {
            if (dispatch.callCount === expectedDispatchCallQuantity) {
                expect(dispatch.secondCall.args[0].state).toBe('ERROR');
                expect(dispatch.secondCall.args[0].type).toBe('_rr_API_TASK');
                expect(dispatch.secondCall.args[0].error).toBe('Error: Failed subtask');
                expect(dispatch.secondCall.args[0].id).toBe(id);
                done();
            } else {
                done.fail();
            }
        };

        // delay to ensure async sub task execution is completed
        setTimeout(checkIfTestIsComplete, 50);
    });

});
