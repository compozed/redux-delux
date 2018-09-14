import {combineReducers} from "../src";
import * as redux from 'redux';
import sinon from 'sinon';
import apiRequestReducer from "../src/apiRequestReducer";
import apiTaskReducer from "../src/apiTaskReducer";

describe('Combine reducers', ()=>{

    let combineReducersStub;

    beforeEach(()=>{
        combineReducersStub = sinon.stub(redux,'combineReducers');
    });

    afterEach(()=>{
        combineReducersStub.restore();
    });

    it('should use redux combine reducers to build reducer', ()=>{
        const testFunc1 = function test1(){};
        const testFunc2 = function test2(){};
        combineReducersStub.onFirstCall().returns(testFunc1);
        combineReducersStub.onSecondCall().returns(testFunc2)

        const reducer = combineReducers();

        expect(combineReducersStub.calledTwice).toBe(true);

        const expectedFirstCallArgs = {"_rr_API_REQUEST": apiRequestReducer, "_rr_API_TASK": apiTaskReducer}
        expect(combineReducersStub.firstCall.args[0]).toEqual(expectedFirstCallArgs);

        const expectedSecondCallArgs = {_rr:testFunc1};
        expect(combineReducersStub.secondCall.args[0]).toEqual(expectedSecondCallArgs);

        expect(reducer).toEqual(testFunc2);
    });

    it('should use redux combine reducers to build reducer with user passed reducers', ()=>{
        const testFunc1 = function test1(){};
        const testFunc2 = function test2(){};
        combineReducersStub.onFirstCall().returns(testFunc1);
        combineReducersStub.onSecondCall().returns(testFunc2)

        const userReducers = {'myReducer': function myReducer(){}};

        const reducer = combineReducers(userReducers);

        expect(combineReducersStub.calledTwice).toBe(true);

        const expectedFirstCallArgs = {"_rr_API_REQUEST": apiRequestReducer, "_rr_API_TASK": apiTaskReducer}
        expect(combineReducersStub.firstCall.args[0]).toEqual(expectedFirstCallArgs);

        const expectedSecondCallArgs = {_rr:testFunc1, ...userReducers};
        expect(combineReducersStub.secondCall.args[0]).toEqual(expectedSecondCallArgs);

        expect(reducer).toEqual(testFunc2);
    });

    it('should throw an error if passing in a reducer that causes a namespace conflict', () => {
        expect(() => combineReducers({ _rr: 'test'})).toThrow();
    });

});
