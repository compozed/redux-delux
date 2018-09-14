import {connect as rrConnect} from '../src';
import sinon from "sinon";
import * as reactRedux from 'react-redux';

describe('connect', ()=> {

    let connectStub;

    beforeEach(()=>{
        connectStub = sinon.stub(reactRedux, 'connect');
    });

    afterEach(()=>{
        connectStub.restore();
    });

    it('should return the results of calling react-redux connect', ()=>{
        const expectedReturn = {};
        connectStub.onFirstCall().returns(expectedReturn);
        expect(rrConnect({})).toBe(expectedReturn);
    });

    it('should pass functions to react-redux connect', ()=>{
        rrConnect({});
        expect(connectStub.firstCall.args.length).toBe(2);
        expect(connectStub.firstCall.args.every(arg => arg instanceof Function)).toBe(true);
    });

    describe('mapStateToPropsWrapper', ()=>{

        it('returns the correct task status function', ()=> {
            rrConnect({});
            let mapStateToPropsWrapper = connectStub.firstCall.args[0];
            const taskId = '123';
            const status = {loading: true};
            const state = {_rr:{_rr_API_TASK: {[taskId]: status}}};

            let taskStatus = mapStateToPropsWrapper(state)['taskStatus'];

            expect(taskStatus(taskId)).toEqual(status);
            expect(taskStatus('arbitraryid')).toEqual({isInitialized: false});
        });

        it('returns the correct request status object without mapStateToProps passed in', ()=> {
            const state = {};
            const testApiRequest = {
                status: sinon.stub()
            };
            const testApiRequestStatusResult = function test() {};
            testApiRequest.status.withArgs(state).returns(testApiRequestStatusResult);
            const api = {request: {testApiRequest}};

            rrConnect(api);

            let mapStateToPropsWrapper = connectStub.firstCall.args[0];
            const requestStatus = mapStateToPropsWrapper(state)['requestStatus'];

            expect(requestStatus).toEqual({testApiRequest: testApiRequestStatusResult});
        });

        it('returns the correct request status object with mapStateToProps passed in', ()=> {
            const state = {};
            const testApiRequest = {
                status: sinon.stub()
            };
            const testApiRequestStatusResult = function test() {};
            testApiRequest.status.withArgs(state).returns(testApiRequestStatusResult);
            const api = {request: {testApiRequest}};
            const userPropKey = 'abc';
            const userProps = {[userPropKey]: 'test'};
            const mapStateToProps = () => userProps;

            rrConnect(api, mapStateToProps);

            let mapStateToPropsWrapper = connectStub.firstCall.args[0];
            const requestStatus = mapStateToPropsWrapper(state)['requestStatus'];

            const userProp = mapStateToPropsWrapper(state)[userPropKey];

            expect(requestStatus).toEqual({testApiRequest: testApiRequestStatusResult});
            expect(userProp).toEqual(userProps[userPropKey])
        });

    });

    describe('mapDispatchToPropsWrapper', () => {

        it('should return empty objects for request and task', () => {

            rrConnect({})
            const mapDispatchToPropsWrapper = connectStub.firstCall.args[1];
            const expected = {request: {}, task: {}};

            expect(mapDispatchToPropsWrapper()).toEqual(expected);

        });

        it('returns the correct request object and properly wraps api calls', () => {
            const testApiRequest = {
                request: sinon.stub()
            };
            testApiRequest.request.withArgs(1).returns(2);
            const dispatch = sinon.stub();
            dispatch.withArgs(2).returns(3);
            const api = {request: {testApiRequest}};

            rrConnect(api);

            let mapDispatchToPropsWrapper = connectStub.firstCall.args[1];
            const request = mapDispatchToPropsWrapper(dispatch)['request'];

            const wrappedTestApiRequest = request['testApiRequest'];

            expect(wrappedTestApiRequest(1)).toEqual(3)
        });

        it('returns the correct task object and properly wraps api calls', () => {
            const testApiTask = (arg)=>2*arg;
            const dispatch = sinon.stub();
            dispatch.withArgs(2).returns(3);
            const api = {task: {testApiTask}};

            rrConnect(api);

            let mapDispatchToPropsWrapper = connectStub.firstCall.args[1];
            const task = mapDispatchToPropsWrapper(dispatch)['task'];

            const wrappedTestApiTask = task['testApiTask'];

            expect(wrappedTestApiTask(1)).toEqual(3)
        });

        it('returns the correct task object with mapDispatchToProps passed in', () => {
            const dispatch = sinon.stub();
            dispatch.withArgs(2).returns(3);
            const api = {};

            const mapDispatchToProps = (dispatch) => ({ userProp: (arg) => dispatch(arg)})

            rrConnect(api, null, mapDispatchToProps);

            let mapDispatchToPropsWrapper = connectStub.firstCall.args[1];
            expect(mapDispatchToPropsWrapper(dispatch)['userProp'](2)).toEqual(3)
        });

    });

});
